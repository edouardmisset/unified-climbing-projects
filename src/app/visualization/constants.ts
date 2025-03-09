import { z } from 'zod'

export const visualizations = ['QR Code', 'Barcode', 'Calendar'] as const
export const visualizationSchema = z.enum(visualizations)
export type VisualizationType = z.infer<typeof visualizationSchema>

export const ascentsOrTrainingList = ['Ascents', 'Training'] as const
export const ascentsOrTrainingSchema = z.enum(ascentsOrTrainingList)
export type AscentsOrTrainingType = z.infer<typeof ascentsOrTrainingSchema>
