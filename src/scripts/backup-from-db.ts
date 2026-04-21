import { writeClimbingDBToBackupJson } from '~/shared/services/backup'

await writeClimbingDBToBackupJson()

globalThis.console.log('Backup complete')
