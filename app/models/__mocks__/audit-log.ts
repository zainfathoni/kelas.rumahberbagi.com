import { build, perBuild } from '@jackfranklin/test-data-bot'
import { AuditLog } from '@prisma/client'
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from '../enum'
import { generateId } from '~/utils/nanoid'

export const auditLogBuilder = build<Omit<AuditLog, 'id' | 'createdAt'>>({
  fields: {
    userId: null,
    action: perBuild(() => AUDIT_ACTION.CREATE),
    entityType: perBuild(() => AUDIT_ENTITY_TYPE.USER),
    entityId: perBuild(() => generateId()),
    oldValue: null,
    newValue: null,
    metadata: null,
    ipAddress: null,
    userAgent: null,
  },
  traits: {
    create: {
      overrides: {
        action: perBuild(() => AUDIT_ACTION.CREATE),
        oldValue: null,
        newValue: perBuild(() => JSON.stringify({ email: 'test@example.com' })),
      },
    },
    update: {
      overrides: {
        action: perBuild(() => AUDIT_ACTION.UPDATE),
        oldValue: perBuild(() => JSON.stringify({ status: 'SUBMITTED' })),
        newValue: perBuild(() => JSON.stringify({ status: 'VERIFIED' })),
      },
    },
    delete: {
      overrides: {
        action: perBuild(() => AUDIT_ACTION.DELETE),
        oldValue: perBuild(() => JSON.stringify({ id: 'deleted-entity' })),
        newValue: null,
      },
    },
    withUser: {
      overrides: {
        userId: perBuild(() => generateId()),
      },
    },
    withMetadata: {
      overrides: {
        ipAddress: perBuild(() => '127.0.0.1'),
        userAgent: perBuild(() => 'Mozilla/5.0 (compatible; test)'),
        metadata: perBuild(() => JSON.stringify({ source: 'test' })),
      },
    },
  },
})
