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
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { AdminProductCard } from '../components/admin/AdminProductCard';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { DeleteProductModal } from '../components/admin/DeleteProductModal';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminTabs } from '../components/admin/AdminTabs';
import { dataConnect } from '../config/firebase';
import {
  mapAdminProductToFirebase,
  mapProductoToAdminProduct,
} from '../utils/firebaseMappers';
import { useRefetchOnFocus } from '../hooks/useRefetchOnFocus';
import { invalidateProductsQueries } from '../utils/queryInvalidation';
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

  useRequireAdmin(navigation);

  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | undefined>();
  const [productToDelete, setProductToDelete] = useState<AdminProduct | undefined>();

  const { data, isPending, isError, refetch } = useListProductosAdmin(dataConnect);
  const createProducto = useCreateProducto(dataConnect);
  const updateProducto = useUpdateProducto(dataConnect);
  const deleteProducto = useDeleteProducto(dataConnect);

  useRefetchOnFocus(refetch);

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

  const openCreateForm = () => {
    setFormMode('create');
    setSelectedProduct(undefined);
    setFormVisible(true);
  };

  const openEditForm = (product: AdminProduct) => {
    setFormMode('edit');
    setSelectedProduct(product);
    setFormVisible(true);
  };

  const handleDelete = (product: AdminProduct) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) {
      return;
    }

    try {
      await deleteProducto.mutateAsync({ id: productToDelete.id });
      await invalidateProductsQueries(queryClient);
      setProductToDelete(undefined);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el producto.');
    }
  };

  const handleSubmitProduct = async (product: AdminProduct) => {
    const payload = mapAdminProductToFirebase(product);

    try {
      if (formMode === 'edit') {
        await updateProducto.mutateAsync({
          id: product.id,
          ...payload,
        });
      } else {
        await createProducto.mutateAsync(payload);
      }
      await invalidateProductsQueries(queryClient);
      setFormVisible(false);
    } catch {
      Alert.alert('Error', 'No se pudo guardar el producto.');
    }
  };

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
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AdminProductCard
              product={item}
              onEdit={() => openEditForm(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ProductFormModal
        visible={formVisible}
        mode={formMode}
        product={selectedProduct}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmitProduct}
      />

      <DeleteProductModal
        visible={!!productToDelete}
        onCancel={() => setProductToDelete(undefined)}
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
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
});
