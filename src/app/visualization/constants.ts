import { z } from 'zod'

export const visualizations = ['Calendar', 'QR Code', 'Barcode'] as const
const visualizationPaths = ['calendar', 'qr-code', 'barcode'] as const
export const visualizationSchema = z.enum(visualizations)
export const visualizationPathSchema = z.enum(visualizationPaths)
type VisualizationType = z.infer<typeof visualizationSchema>
type VisualizationPathType = z.infer<typeof visualizationPathSchema>

export const PATH_TO_VISUALIZATION = {
  barcode: 'Barcode',
  calendar: 'Calendar',
  'qr-code': 'QR Code',
} as const satisfies Record<VisualizationPathType, VisualizationType>
