import { writeClimbingDBToBackupJson } from '~/services/backup'

await writeClimbingDBToBackupJson()

globalThis.console.log('Backup complete')
