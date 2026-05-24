# Registro de Interacciones de Desarrollo y Consultas de IA · StackBurger E1

* **Materia:** Desarrollo de Aplicaciones Móviles  
* **Entrega:** Entrega 1 — MVP Básico (E1)  
* **Asistente de IA:** Asistente de Desarrollo (Google DeepMind)  
* **Archivo de Entrega:** `/ia/entrega-1/conversaciones.md`

---

## 📌 Índice de Temas Consultados

1. [Consulta 1: Definición del Stack Tecnológico, Arquitectura de Componentes y Diseño de la Estructura de Directorios Modular para el MVP](#consulta-1-definición-del-stack-tecnológico-arquitectura-de-componentes-y-diseño-de-la-estructura-de-directorios-modular-para-el-mvp)
2. [Consulta 2: Diagnóstico y solución a fallos en la localización del Android SDK en sistemas Windows mediante inyección de local.properties](#consulta-2-diagnóstico-y-solución-a-fallos-en-la-localización-del-android-sdk-en-sistemas-windows-mediante-inyección-de-localproperties)
3. [Consulta 3: Resolución del error de enlace nativo en despliegue de dispositivos (DeviceException y reinicio del servidor ADB)](#consulta-3-resolución-del-error-de-enlace-nativo-en-despliegue-de-dispositivos-deviceexception-y-reinicio-del-servidor-adb)
4. [Consulta 4: Reorganización arquitectónica del repositorio y estrategia de modularización a la carpeta raíz /app con mitigación de bloqueos de E/S en Windows](#consulta-4-reorganización-arquitectónica-del-repositorio-y-estrategia-de-modularización-a-la-carpeta-raíz-app-con-mitigación-de-bloqueos-de-es-en-windows)
5. [Consulta 5: Actualización y re-estructuración estratégica del archivo descriptivo del proyecto (README.md)](#consulta-5-actualización-y-re-estructuración-estratégica-del-archivo-descriptivo-del-proyecto-readmemd)

---

## 🛠️ Competencias de IA Aplicadas en el Ciclo de Vida del Software

Durante el proceso incremental de desarrollo, compilación y despliegue del MVP (E1) de **StackBurger**, la Inteligencia Artificial proveyó asistencia avanzada bajo rigurosas pautas de ingeniería de software:
* **Planificación Arquitectónica y Diseño Modular:** Estructuración del entorno móvil de React Native aislando la interfaz de presentación de las reglas del negocio, logrando un desacoplamiento óptimo mediante React Context y Custom Hooks.
* **Depuración de Entornos Nativos de Compilación:** Solución a problemas clásicos de enlace del Android SDK mediante la inyección del mapa físico del disco con archivos `local.properties`.
* **Diagnóstico de Enlaces de Red y ADB:** Resolución de excepciones en la capa de hardware y emulación a través del reinicio y optimización de sockets del servidor de ADB.

---

## 💬 Transcripción de Consultas de Desarrollo

### Consulta 1: Definición del Stack Tecnológico, Arquitectura de Componentes y Diseño de la Estructura de Directorios Modular para el MVP

**Usuario:**
> Presento el Documento de Alcance Técnico y Funcional para el MVP Básico (E1) del proyecto StackBurger. El objetivo es desarrollar una aplicación de pedidos digitales para optimizar la experiencia de compra en locales gastronómicos, eliminando filas y gestionando transacciones. Requiero que me propongas un stack tecnológico robusto que asegure el cumplimiento de los Requerimientos Funcionales (catálogo visual, personalización, gestión de carrito y checkout validado) y los No Funcionales (tiempos de respuesta inferiores a 2 segundos, compatibilidad mínima con Android API 24+, navegación nativa fluida, y adaptabilidad visual). Asimismo, solicito el diseño de una arquitectura y estructura de directorios modular que organice de forma escalable el código TypeScript.

**Asistente de IA:**
> Tomando como base estricta la rúbrica del proyecto y los requerimientos funcionales del documento de alcance, se expone a continuación el diseño técnico y arquitectónico óptimo para la realización del MVP:
> 
> ### 📱 Propuesta de Stack de Software
> 1. **Core Framework:** **React Native CLI (Bare Workflow)**. Garantiza la máxima optimización de recursos a nivel de hardware, cubriendo sin inconvenientes la compatibilidad con Android API 24+ de forma nativa.
> 2. **Navegación:** **React Navigation (Stack Navigator)**. Provee una pila de navegación nativa con transiciones fluidas por hardware, reteniendo reactivamente el estado de la app al realizar transiciones hacia atrás.
> 3. **Gestión de Estado Global (Carrito):** **React Context API + `useReducer`** en TypeScript. Centraliza de forma predecible el ciclo de vida del carrito (alta, edición, conteo y cálculo de totales) sin la sobrecarga de dependencias externas pesadas.
> 4. **Estilos y Responsividad:** **Vanilla StyleSheet (React Native)**. El uso de Flexbox nativo permite la correcta adaptabilidad responsiva requerida para la diversidad de dispositivos del local físico.
> 
> ### 📂 Arquitectura de Directorios Modular
> Se propone estructurar el código en una carpeta unificada `/src` bajo el subdirectorio de aplicación `/app`, organizando el software por su responsabilidad única:
> 
> ```text
> SBURGER/
> ├── app/                         # Carpeta raíz del entorno React Native CLI
> │   ├── android/                 # Módulo nativo compilable para Android (API 24+)
> │   ├── ios/                     # Módulo nativo para iOS (escalabilidad futura)
> │   ├── src/                     # Código fuente del aplicativo
> │   │   ├── components/          # Componentes visuales atómicos reutilizables
> │   │   │   ├── BurgerCard.tsx   # Tarjeta de catálogo para el renderizado de productos
> │   │   │   ├── CartItem.tsx     # Fila interactiva para el desglose del carrito
> │   │   │   ├── CustomButton.tsx # Componente de interacción táctil con área >= 48dp (RNF)
> │   │   │   └── ExtraOption.tsx  # Controlador de adicionales con incrementadores atómicos
> │   │   ├── constants/           # Recursos estáticos e inmutables del sistema
> │   │   │   ├── colors.ts        # Definición del sistema de diseño (coral, gris oscuro, blanco)
> │   │   │   └── mockData.ts      # Catálogo JSON del menú de hamburguesas
> │   │   ├── context/             # Capa lógica de estado compartido
> │   │   │   └── CartContext.tsx  # Motor reductor del carrito con persistencia reactiva
> │   │   ├── hooks/               # Reglas de negocio y lógica asíncrona
> │   │   │   └── useBusinessHours.ts # Validador del horario de atención comercial (19:00 - 23:30 hs)
> │   │   ├── navigation/          # Enrutamiento y pila de navegación nativa
> │   │   │   └── AppNavigator.tsx # Configuración de transiciones entre HomeScreen y DetailScreen
> │   │   └── screens/             # Vistas de visualización principal
> │   │       ├── HomeScreen.tsx   # Catálogo principal con lógica de carga y manejo de fallos
> │   │       ├── DetailScreen.tsx # Personalizador con límites de extras e ingresos de notas
> │   │       ├── CartScreen.tsx   # Resumen matemático de ítems, adiciones y costos de envío
> │   │       └── CheckoutScreen.tsx # Formulario con validación de datos del cliente
> │   └── App.tsx                  # Envoltura de Providers y punto de arranque del compilador
> └── documentacion/               # Archivos de rúbricas y especificaciones de la cátedra
> ```
> 
> ### ⚙️ Mapeo Técnico de Reglas de Negocio en Código:
> * **RN-01 (Monto de Envío Dinámico):** El reductor de `CartContext` inicializa dinámicamente el costo de envío en `0` si el array del carrito de compras está vacío, inhabilitando en la interfaz visual el botón de checkout.
> * **RN-02 (Límite de Adicionales):** Al invocar `ADD_TO_CART`, se restringe programáticamente mediante `Math.min(5, count)` el tope máximo de adiciones por cada ingrediente extra (cebolla, panceta, cheddar, carne).
> * **RN-03 (Límite de Aclaraciones Especiales):** Se añade un campo `maxLength={150}` en el componente `TextInput` de aclaraciones especiales en `DetailScreen.tsx`, acompañado de un contador dinámico visual en color rojo que advierte e impide el desborde en comanda.
> * **RN-05 (Horario de Cierre de Cocina):** El custom hook `useBusinessHours.ts` analiza la hora actual del sistema mediante el objeto nativo `Date` de JavaScript, arrojando un estado booleano para bloquear el despacho del pedido fuera de la franja horaria permitida (19:00 a 23:30 hs).

---

### Consulta 2: Diagnóstico y solución a fallos en la localización del Android SDK en sistemas Windows mediante inyección de local.properties

**Usuario:**
> Durante la etapa de construcción nativa y despliegue del aplicativo móvil de React Native mediante el comando `npm run android` en un sistema operativo Windows, el motor de compilación Gradle aborta el proceso de forma crítica, arrojando el error `SDK location not found. Define location with an sdk.dir in the local.properties file or with an ANDROID_HOME environment variable`. ¿Cuál es la causa subyacente de este fallo de vinculación y cómo puedo solucionarlo de forma permanente y robusta en mi estación de trabajo?

**Asistente de IA:**
> #### 1. Diagnóstico y Causa Subyacente
> El compilador automatizado de tareas de Android, Gradle, necesita enlazar librerías binarias nativas de compilación provistas por el kit de desarrollo (Android SDK). En estaciones de trabajo Windows, Gradle busca esta ruta a través de la variable de entorno del sistema `ANDROID_HOME`.
> 
> Si no se ha configurado la variable de entorno global, o si el proceso de terminal en ejecución (PowerShell/CMD) carece de permisos de lectura para heredar el mapa de variables de entorno de Windows, Gradle fallará inmediatamente al no poder localizar el compilador nativo de Java/C++.
> 
> #### 2. Solución Arquitectónica Recomendada
> Para evitar inconsistencias de enlace a nivel global, se debe inyectar de forma directa y local la ruta física absoluta de las herramientas del SDK de Android en el subproyecto nativo.
> 
> Proceda a crear el archivo local de propiedades en la siguiente ruta:
> `/app/android/local.properties`
> 
> Introduzca la siguiente directiva apuntando al directorio de instalación por defecto del SDK de su usuario en Windows:
> 
> ```ini
> sdk.dir=C:/Users/Joaquin/AppData/Local/Android/Sdk
> ```
> 
> > [!IMPORTANT]
> > **Detalle de Escape de Caracteres en Windows:** Note que en el archivo de propiedades se emplean barras diagonales estándar (`/`) en lugar de barras invertidas (`\`). Gradle procesa este archivo interpretando las diagonales invertidas como secuencias de escape de caracteres de cadena, lo que provocaría un error de sintaxis nativa si no se realiza esta adaptación.
> 
> #### 3. Verificación Física del SDK
> Si el error persiste posterior a la creación del archivo, significa que no se ha descargado el SDK propiamente dicho en el disco. Para corregirlo:
> 1. Inicie la interfaz de **Android Studio**.
> 2. Si es el arranque inicial, complete el asistente de bienvenida (**Setup Wizard**) con configuración estándar para que el sistema descargue de forma automatizada los componentes e imágenes del SDK.
> 3. Si la interfaz principal ya está activa, acceda a **Settings** -> **Appearance & Behavior** -> **System Settings** -> **Android SDK** y verifique que la ruta de destino coincida con el archivo `local.properties`.

---

### Consulta 3: Resolución del error de enlace nativo en despliegue de dispositivos (DeviceException y reinicio del servidor ADB)

**Usuario:**
> La compilación del código nativo Java/Kotlin y C++ mediante Gradle se completa de forma exitosa (100% de tareas ejecutadas de fondo). Sin embargo, el despliegue a dispositivo de destino falla con la excepción `com.android.builder.testing.api.DeviceException: No connected devices!` o `No online devices found`. ¿Cuáles son las causas y cómo restablecer la conexión del puente de depuración (ADB) y la instancia del emulador AVD (Android Virtual Device) para lograr un despliegue exitoso?

**Asistente de IA:**
> #### 1. Diagnóstico Técnico
> Este escenario de error indica que el compilador nativo ha estructurado el paquete compilado en depuración (`app-debug.apk`) con éxito, pero la herramienta de subida al dispositivo en caliente (Android Debug Bridge - ADB) no encuentra un canal de comunicación de sockets TCP activo para inyectar el archivo binario. Esto se debe a dos causas principales:
> * **Ausencia de Emulación Activa:** No se encuentra levantado en memoria ningún dispositivo virtual emulado (AVD).
> * **Bloqueo del Demonio ADB (ADB Server):** La pila de red interna del puente de comunicación ADB se encuentra bloqueada, desincronizada o bloqueando el puerto estándar `5037`.
> 
> #### 2. Protocolo de Saneamiento y Reinicio del Servidor ADB
> Debe depurar la cola de red del puente de comunicación cerrando forzadamente el daemon y reiniciando el servicio desde la consola de comandos de Windows:
> 
> ```powershell
> # Detención absoluta del proceso daemon congelado
> C:\Users\Joaquin\AppData\Local\Android\Sdk\platform-tools\adb.exe kill-server
> 
> # Inicialización limpia del socket de red
> C:\Users\Joaquin\AppData\Local\Android\Sdk\platform-tools\adb.exe start-server
> ```
> 
> #### 3. Verificación de Dispositivos y Despliegue en Emulador
> 1. Corrobore si el sistema operativo registra el dispositivo virtual de destino con el comando:
>    ```bash
>    adb devices
>    ```
> 2. Si la lista retorna vacía, abra **Android Studio** -> **Virtual Device Manager**.
> 3. En caso de no poseer ningún emulador creado, seleccione **Create Device**, asigne un perfil responsivo (ej. **Pixel 6 / API 33**) y permita la descarga de la imagen correspondiente.
> 4. Inicie el emulador haciendo clic en el botón de reproducción (**Play**). Una vez que la pantalla de inicio de Android esté cargada en su totalidad en el entorno gráfico, reejecute en la consola:
>    ```bash
>    npm run android
>    ```
>    *La app se desplegará e iniciará en pocos segundos debido a que las dependencias nativas pesadas de Gradle ya se encuentran completamente cacheadas en memoria.*

---

### Consulta 4: Reorganización arquitectónica del repositorio y estrategia de modularización a la carpeta raíz /app con mitigación de bloqueos de E/S en Windows

**Usuario:**
> Con el fin de optimizar el orden estructural del repositorio, aislar el entorno móvil del resto de la documentación académica y preparar el proyecto para futuras entregas (E2/E3), requiero reorganizar la base de código. Sin embargo, al intentar trasladar carpetas nativas e instaladas (`android/`, `ios/`, `node_modules/`, `src/`) a un nuevo subdirectorio `/app/`, el sistema operativo Windows aborta la operación arrojando errores de 'Acceso Denegado' y bloqueo de recursos. ¿A qué se deben estos bloqueos del sistema de archivos y cuál es la estrategia recomendada para efectuar esta mudanza arquitectónica de forma segura y sin corromper las dependencias de Metro?

**Asistente de IA:**
> #### 1. Causa del Bloqueo del Sistema de Archivos en Windows
> El kernel del sistema operativo Windows implementa mecanismos estrictos de exclusión mutua de archivos. Cuando el servidor empaquetador de JavaScript Metro (`npm start`) o el emulador de Android están activos, mantienen descriptores de archivos (*file handles*) y sockets abiertos sobre librerías nativas clave, dependencias binarias en `node_modules` y carpetas de código fuente en `src/`. Esto le impide al sistema operativo ejecutar operaciones de renombrado, movimiento o borrado sobre esos subdirectorios, resultando en excepciones inmediatas de **Acceso Denegado**.
> 
> #### 2. Estrategia de Mitigación y Mudanza Segura
> Para resolver el bloqueo de E/S y asegurar la modularización sin pérdida de consistencia en el control de cambios de Git, aplique el siguiente procedimiento técnico secuencial:
> 
> 1. **Corte Seguro de Procesos:** Cierre todas las instancias abiertas de la terminal y finalice el servidor de Metro presionando `Ctrl + C` en la consola de comandos de Node.
> 2. **Creación del Espacio Aislado:** Cree el nuevo directorio de forma segura:
>    ```powershell
>    New-Item -Path app -ItemType Directory -Force
>    ```
> 3. **Estrategia de Copiado y Clonación de Recursos:** Para evadir bloqueos en caliente remanentes, realice un copiado recursivo completo a `/app/` excluyendo directorios protegidos por el sistema (ej. `.git` y `.gradle` local):
>    ```powershell
>    Get-ChildItem -Path . -Force | Where-Object { $_.Name -notin 'app', 'documentacion', 'README.md', '.git', '.' , '..' } | Copy-Item -Destination app -Recurse -Force
>    ```
> 4. **Limpieza del Entorno Antiguo:** Una vez replicado el ecosistema en la carpeta de destino, elimine los residuos y archivos duplicados de la raíz.
> 5. **Reconstrucción del Árbol de Dependencias:** Al trasladar el archivo `package.json` de ubicación física, es indispensable refrescar el enlazador de módulos. Ingrese a la carpeta aislada y ejecute una instalación limpia:
>    ```bash
>    cd app
>    npm install
>    ```
> 6. **Configuración del GitIgnore Global:** Configure un archivo `.gitignore` en la raíz del repositorio para impedir que los directorios locales de Gradle (`/app/android/.gradle`), variables del SDK y compilados de Node se infiltren en el control de cambios de Visual Studio Code.

---

### Consulta 5: Actualización y re-estructuración estratégica del archivo descriptivo del proyecto (README.md)

**Usuario:**
> Posterior a la exitosa reorganización modular y traslado del proyecto a la carpeta raíz `/app/`, es indispensable actualizar el archivo técnico principal del proyecto (`README.md`). ¿Qué modificaciones estratégicas y de usabilidad consideras pertinentes introducir para reflejar la nueva arquitectura y guiar a otros desarrolladores o docentes en la correcta ejecución local mediante comandos de cambio de directorio?

**Asistente de IA:**
> La actualización del archivo **`README.md`** se ha realizado bajo rigurosos criterios de legibilidad técnica y usabilidad para garantizar que cualquier miembro de la cátedra académica o del equipo pueda inicializar y testear la aplicación de forma ágil y autoexplicativa. Se han estructurado las siguientes adiciones estratégicas:
> 
> 1. **Actualización de Scripts con Transición de Directorios (`cd app`):** Se modificó la sección de instalación y despliegue del empaquetador incorporando de forma explícita la secuencia de navegación al subdirectorio móvil:
>    ```bash
>    cd stackburger-app/app
>    npm install
>    npm run android
>    ```
> 2. **Esquematización Detallada de la Estructura Modular:** Se reemplazó el contenedor vacío de arquitectura por un mapa visual completo en formato estructurado, detallando los roles de cada componente técnico (`components/`, `constants/`, `context/`, `hooks/`, `navigation/` y `screens/`) para exponer con total transparencia la alta calidad del desacoplamiento de software logrado bajo `/app/src/`.
> 3. **Variables de Entorno e Integrantes:** Se mantuvo de manera consistente la guía de variables de entorno y se actualizó la sección de colaboradores enlazados a sus respectivos perfiles de GitHub.
