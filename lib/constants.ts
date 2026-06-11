// User roles in the system
export const USER_ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'almacenista', label: 'Almacenista' },
  { value: 'solicitante', label: 'Solicitante' },
] as const

// Branches (sucursales) in Grupo Hijuelas
export const SUCURSALES = [
  'HIJUELAS',
  'OSORNO',
] as const

// Branches (sucursales) for exit
export const SUCURSALES_SALIDA = [
  'HIJUELAS',
  'OSORNO',
] as const

// Warehouse (bodegas) types
export const BODEGA_INGRESOSALIDA = [
  'BODEGA PRINCIPAL',
  'BODEGA SECUNDARIA',
  'BODEGA TRANSFERENCIA',
] as const

// Inventory movement types
export const TIPO_INVENTARIO = [
  'MEDIOS & POTES',
  'GENERAL'
] as const

// Inventory areas types
export const AREA_DESTINO = [
  'HARDENING ESTERIL',
  'FRUTALES (AFM)',
  'CIDI',
  'MENTENCION',
  'ASEO',
  'OSORNO',
  'MEDIOS',
  'CHEQUEO',
  'TRANSFER',
  'DESPACHO',
  'LAVADERO',
  'ADMINISTRACION',
  'BODEGA IVL',
  'CONSUMO INTERNO',
  'CONSUMO EXTERNO',
  'MERMA',
  'OTROS',
] as const

// Product categories
export const CATEGORIAS = [
  'SIN DEFINIR',
  'LIBRERIA',
  'ASEO',
  'TRANSFER',
  'AGUA',
  'EPP',
  'MANTENCION',
  'MEDIO',
  'OFICINA',
  'BODEGA',
  'P. AUXILIO',
  'INSUMO',
  'EMBARQUE',
  'OTROS',
] as const

// Units of measurement
export const UNIDADES_MEDIDA = [
  'UNIDAD',
  'KG',
  'LITRO',
  'METRO',
  'CAJA',
  'BOLSA',
  'TAMBOR',
  'TANQUE',
  'GENERAL',
] as const

// Product origin
export const ORIGEN_PRODUCTO = [
  'NACIONAL',
  'INTERNACIONAL',
] as const
