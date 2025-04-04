import { z } from 'zod'

export const visualizations = ['Calendar', 'QR Code', 'Barcode'] as const
export const visualizationSchema = z.enum(visualizations)
export type VisualizationType = z.infer<typeof visualizationSchema>

const ascentsOrTraining = ['Ascents', 'Training'] as const
export const ascentsOrTrainingSchema = z.enum(ascentsOrTraining)
export type AscentsOrTrainingType = z.infer<typeof ascentsOrTrainingSchema>
