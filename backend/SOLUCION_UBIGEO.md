# 📚 Guía: Cómo Implementar Selectores Jerárquicos (Departamento → Provincia → Distrito)

## 🎯 Concepto Principal

Cuando tienes datos **jerárquicos** (uno depende del otro), necesitas:

1. **Estructura de datos anidada** (padre → hijos)
2. **Lógica reactiva** (cuando cambia el padre, actualizar los hijos)
3. **Estados separados** para cada nivel

---

## 📊 Estructura de Datos

### ❌ Estructura INCORRECTA (lo que tienes ahora):
```typescript
// Todos los departamentos en un solo array
cities = [
  { name: 'Lima', code: 'LIM' },
  { name: 'Arequipa', code: 'ARE' }
]
// ❌ No hay relación con provincias ni distritos
```

### ✅ Estructura CORRECTA (lo que necesitas):
```typescript
departamentos = [
  {
    id: '15',
    nombre: 'Lima',
    provincias: [           // ← Hijos del departamento
      {
        id: '1501',
        nombre: 'Lima',
        distritos: [         // ← Hijos de la provincia
          { id: '150101', nombre: 'Lima' },
          { id: '150102', nombre: 'Ancón' }
        ]
      }
    ]
  }
]
```

---

## 🔄 Flujo de la Lógica

```
1. Usuario selecciona DEPARTAMENTO
   ↓
2. Se activa evento onChange
   ↓
3. Se filtran las PROVINCIAS del departamento seleccionado
   ↓
4. Se limpian PROVINCIA y DISTRITO seleccionados
   ↓
5. Usuario selecciona PROVINCIA
   ↓
6. Se activa evento onChange
   ↓
7. Se filtran los DISTRITOS de la provincia seleccionada
   ↓
8. Se limpia DISTRITO seleccionado
   ↓
9. Usuario selecciona DISTRITO
```

---

## 💻 Implementación en Angular

### Paso 1: Variables de Estado

```typescript
// Datos completos (fuente de verdad)
departamentos: Departamento[] = ubigeoData;

// Opciones disponibles para cada dropdown (se actualizan dinámicamente)
departamentosDisponibles: Departamento[] = [];
provinciasDisponibles: Provincia[] = [];
distritosDisponibles: Distrito[] = [];

// Valores seleccionados
departamentoSeleccionado: Departamento | null = null;
provinciaSeleccionada: Provincia | null = null;
distritoSeleccionado: Distrito | null = null;
```

### Paso 2: Métodos Reactivos

```typescript
// Cuando cambia el DEPARTAMENTO
onDepartamentoChange(departamento: Departamento) {
  // 1. Guardar selección
  this.departamentoSeleccionado = departamento;
  
  // 2. Filtrar provincias del departamento seleccionado
  this.provinciasDisponibles = departamento.provincias;
  
  // 3. Limpiar selecciones dependientes
  this.provinciaSeleccionada = null;
  this.distritoSeleccionado = null;
  this.distritosDisponibles = [];
}

// Cuando cambia la PROVINCIA
onProvinciaChange(provincia: Provincia) {
  // 1. Guardar selección
  this.provinciaSeleccionada = provincia;
  
  // 2. Filtrar distritos de la provincia seleccionada
  this.distritosDisponibles = provincia.distritos;
  
  // 3. Limpiar selección dependiente
  this.distritoSeleccionado = null;
}

// Cuando cambia el DISTRITO
onDistritoChange(distrito: Distrito) {
  this.distritoSeleccionado = distrito;
}
```

### Paso 3: Inicialización

```typescript
ngOnInit() {
  // Al iniciar, solo mostrar departamentos
  this.departamentosDisponibles = this.departamentos;
  this.provinciasDisponibles = [];
  this.distritosDisponibles = [];
}
```

---

## 🎨 En el Template (HTML)

```html
<!-- Dropdown de DEPARTAMENTO -->
<p-dropdown 
  [options]="departamentosDisponibles" 
  [(ngModel)]="departamentoSeleccionado"
  optionLabel="nombre"
  placeholder="Seleccione un departamento"
  (onChange)="onDepartamentoChange($event.value)"
  [disabled]="false">
</p-dropdown>

<!-- Dropdown de PROVINCIA -->
<p-dropdown 
  [options]="provinciasDisponibles" 
  [(ngModel)]="provinciaSeleccionada"
  optionLabel="nombre"
  placeholder="Seleccione una provincia"
  (onChange)="onProvinciaChange($event.value)"
  [disabled]="!departamentoSeleccionado">  <!-- ← Deshabilitado si no hay departamento -->
</p-dropdown>

<!-- Dropdown de DISTRITO -->
<p-dropdown 
  [options]="distritosDisponibles" 
  [(ngModel)]="distritoSeleccionado"
  optionLabel="nombre"
  placeholder="Seleccione un distrito"
  (onChange)="onDistritoChange($event.value)"
  [disabled]="!provinciaSeleccionada">  <!-- ← Deshabilitado si no hay provincia -->
</p-dropdown>
```

---

## 🔑 Conceptos Clave para Aprender

### 1. **Datos Jerárquicos**
- Los datos tienen una relación padre-hijo
- Un padre puede tener múltiples hijos
- Los hijos dependen del padre

### 2. **Programación Reactiva**
- Cuando cambia un valor, automáticamente se actualizan los valores relacionados
- En Angular: usar eventos `(onChange)` o `@watch`

### 3. **Estado de la Aplicación**
- Mantener estados separados para cada nivel
- Limpiar estados dependientes cuando cambia el padre

### 4. **Filtrado de Datos**
- Filtrar arrays basándose en la selección del padre
- Usar métodos como `filter()`, `find()`, `map()`

---

## 📝 Ejemplo Completo Simplificado

```typescript
// 1. Tienes datos jerárquicos
const paises = [
  {
    nombre: 'Perú',
    ciudades: [
      {
        nombre: 'Lima',
        distritos: ['Miraflores', 'San Isidro', 'Surco']
      }
    ]
  }
];

// 2. Variables de estado
let paisSeleccionado = null;
let ciudadesDisponibles = [];
let ciudadSeleccionada = null;
let distritosDisponibles = [];

// 3. Cuando seleccionas un país
function seleccionarPais(pais) {
  paisSeleccionado = pais;
  ciudadesDisponibles = pais.ciudades;  // ← Filtrar ciudades
  ciudadSeleccionada = null;              // ← Limpiar ciudad
  distritosDisponibles = [];             // ← Limpiar distritos
}

// 4. Cuando seleccionas una ciudad
function seleccionarCiudad(ciudad) {
  ciudadSeleccionada = ciudad;
  distritosDisponibles = ciudad.distritos;  // ← Filtrar distritos
}
```

---

## 🚀 Próximos Pasos

1. **Obtener datos completos de Ubigeo** (todos los departamentos, provincias y distritos de Perú)
2. **Implementar la lógica reactiva** en el componente
3. **Actualizar el template** con los eventos onChange
4. **Probar** seleccionando diferentes departamentos

---

## 📚 Recursos para Aprender Más

- **Angular Reactive Forms**: Para manejar formularios complejos
- **RxJS Observables**: Para manejar flujos de datos reactivos
- **State Management**: Para aplicaciones más complejas (NgRx, Akita)
