import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
  ListRenderItem,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import {
  useCreateProducto,
  useDeleteProducto,
  useListProductosAdmin,
  useUpdateProducto,
} from '@dataconnect/generated/react';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AdminProduct } from '../constants/adminProducts';
import { Colors } from '../constants/colors';
import { FLAT_LIST_PERF_PROPS } from '../constants/listPerformance';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { AdminProductCard } from '../components/admin/AdminProductCard';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { DeleteProductModal } from '../components/admin/DeleteProductModal';
import { SucursalPricesModal } from '../components/admin/SucursalPricesModal';
import { SucursalAvailabilityModal } from '../components/admin/SucursalAvailabilityModal';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminTabs } from '../components/admin/AdminTabs';
import { dataConnect } from '../config/firebase';
import {
  mapAdminProductToFirebase,
  mapProductoToAdminProduct,
} from '../utils/firebaseMappers';
import { isValidProductId } from '../utils/productIds';
import {
  fetchAdminProductsFromServer,
  findProductIdOnServer,
  reloadProductsFromServer,
  syncProductCachesAfterEdit,
} from '../utils/productQueryCache';
import { createProductoSucursalPricesForAllBranches } from '../services/productoSucursalService';
import { useRequireAdmin } from '../navigation/useRoleGuard';

type AdminProductsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminProducts'
>;

interface AdminProductsScreenProps {
  navigation: AdminProductsScreenNavigationProp;
}

export const AdminProductsScreen: React.FC<AdminProductsScreenProps> = ({
  navigation,
}) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useRequireAdmin(navigation);

  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | undefined>();
  const [productToDelete, setProductToDelete] = useState<AdminProduct | undefined>();
  const [productForPrices, setProductForPrices] = useState<AdminProduct | undefined>();
  const [productForAvailability, setProductForAvailability] = useState<AdminProduct | undefined>();

  const { data, isPending, isError, refetch, isRefetching } =
    useListProductosAdmin(dataConnect);
  const createProducto = useCreateProducto(dataConnect);
  const updateProducto = useUpdateProducto(dataConnect);
  const deleteProducto = useDeleteProducto(dataConnect);

  const products = useMemo(
    () => (data?.productos ?? []).filter(item => item.activo).map(mapProductoToAdminProduct),
    [data?.productos],
  );

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.background);
      }
    }, []),
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return products;
    }
    return products.filter(product =>
      product.name.toLowerCase().includes(query),
    );
  }, [products, searchQuery]);

  const reloadProducts = useCallback(async () => {
    await reloadProductsFromServer(queryClient, refetch);
  }, [queryClient, refetch]);

  const resolveProductId = useCallback(
    async (target: AdminProduct): Promise<string | undefined> => {
      if (isValidProductId(target.id)) {
        return target.id;
      }

      const freshData = await fetchAdminProductsFromServer();
      return findProductIdOnServer(freshData, target);
    },
    [],
  );

  const openCreateForm = useCallback(() => {
    setFormMode('create');
    setSelectedProduct(undefined);
    setFormVisible(true);
  }, []);

  const openEditForm = useCallback((product: AdminProduct) => {
    setFormMode('edit');
    setSelectedProduct(product);
    setFormVisible(true);
  }, []);

  const openPricesModal = useCallback((product: AdminProduct) => {
    setProductForPrices(product);
  }, []);

  const openAvailabilityModal = useCallback((product: AdminProduct) => {
    setProductForAvailability(product);
  }, []);

  const handleDeleteProduct = useCallback((product: AdminProduct) => {
    setProductToDelete(product);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const productId = await resolveProductId(productToDelete);

      if (!productId) {
        Alert.alert('Error', 'No se encontró el producto. Actualizá la lista e intentá de nuevo.');
        await reloadProducts();
        return;
      }

      await deleteProducto.mutateAsync({ id: productId });
      await reloadProducts();
      setProductToDelete(undefined);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el producto.');
      await reloadProducts();
    } finally {
      setIsDeleting(false);
    }
  }, [deleteProducto, isDeleting, productToDelete, reloadProducts, resolveProductId]);

  const handleSubmitProduct = async (product: AdminProduct) => {
    const payload = mapAdminProductToFirebase(product);
    setIsSaving(true);

    try {
      if (formMode === 'edit') {
        const lookupProduct = selectedProduct ?? product;
        let productId = isValidProductId(product.id)
          ? product.id
          : await resolveProductId(lookupProduct);

        if (!productId) {
          Alert.alert('Error', 'No se pudo identificar el producto. Actualizá la lista e intentá de nuevo.');
          await reloadProducts();
          return;
        }

        await updateProducto.mutateAsync({
          id: productId,
          ...payload,
        });

        syncProductCachesAfterEdit(queryClient, { ...product, id: productId });
      } else {
        const result = await createProducto.mutateAsync(payload);
        const productoId = result.producto_insert.id;
        await createProductoSucursalPricesForAllBranches(productoId, payload.precio);
        await reloadProducts();
      }

      setFormVisible(false);
    } catch {
      Alert.alert('Error', 'No se pudo guardar el producto.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderProductItem = useCallback<ListRenderItem<AdminProduct>>(
    ({ item }) => (
      <AdminProductCard
        product={item}
        onEdit={openEditForm}
        onEditPrices={openPricesModal}
        onEditAvailability={openAvailabilityModal}
        onDelete={handleDeleteProduct}
      />
    ),
    [handleDeleteProduct, openAvailabilityModal, openEditForm, openPricesModal],
  );

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <AdminHeader navigation={navigation} />
      <AdminTabs activeTab="products" navigation={navigation} />

      <View style={styles.toolbar}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar producto..."
            placeholderTextColor={Colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={openCreateForm}
          accessibilityLabel="Agregar producto"
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {isPending ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>No se pudieron cargar los productos.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={reloadProducts}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id ?? `${item.name}-${item.price}`}
          renderItem={renderProductItem}
          {...FLAT_LIST_PERF_PROPS}
          removeClippedSubviews={false}
          contentContainerStyle={[
            styles.listContent,
            filteredProducts.length === 0 && styles.listContentEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshing={isRefetching || isSaving}
          onRefresh={reloadProducts}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No hay productos activos.</Text>
            </View>
          }
        />
      )}

      <ProductFormModal
        visible={formVisible}
        mode={formMode}
        product={selectedProduct}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmitProduct}
      />

      <SucursalPricesModal
        visible={!!productForPrices}
        product={productForPrices}
        onClose={() => setProductForPrices(undefined)}
      />

      <SucursalAvailabilityModal
        visible={!!productForAvailability}
        product={productForAvailability}
        onClose={() => setProductForAvailability(undefined)}
      />

      <DeleteProductModal
        visible={!!productToDelete}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setProductToDelete(undefined);
          }
        }}
        onConfirm={confirmDelete}
      />
    </ScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.accentText,
    marginTop: -2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.accent,
  },
  retryButtonText: {
    color: Colors.accentText,
    fontWeight: '700',
  },
});
