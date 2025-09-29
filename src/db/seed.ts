import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Starting database seed...');

  // Create SUPER_ADMIN user
  const adminEmail = 'super_admin@mail.local';
  const adminPassword = 'Admin@123';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  let adminUser;
  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword);
    
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        isActive: true
      }
    });

    logger.info(`✅ Created SUPER_ADMIN user: ${adminEmail}`);
  } else {
    adminUser = existingAdmin;
    logger.info(`ℹ️  SUPER_ADMIN user already exists: ${adminEmail}`);
  }

  // Create default email template
  const templateName = 'Classic Birthday';
  const existingTemplate = await prisma.emailTemplate.findUnique({
    where: { name: templateName }
  });

  let defaultTemplate;
  if (!existingTemplate) {
    defaultTemplate = await prisma.emailTemplate.create({
      data: {
        name: templateName,
        subject: '🎉 Happy Birthday {{firstName}}!',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4a90e2; text-align: center;">🎉 Happy Birthday!</h1>
            
            <p style="font-size: 18px; line-height: 1.6;">
              Dear {{firstName}},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Wishing you a very happy birthday! We hope your special day on {{dob}} is filled with joy, laughter, and wonderful memories.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Thank you for being part of our community. May this new year of life bring you happiness, success, and all the things you've been hoping for.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 20px; color: #4a90e2; font-weight: bold;">
                🎂 Enjoy your special day! 🎂
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              Best wishes,<br>
              The Mailer8 Team
            </p>
          </div>
        `.trim(),
        isActive: true,
        createdBy: adminUser.id
      }
    });

    logger.info(`✅ Created default template: ${templateName}`);
  } else {
    defaultTemplate = existingTemplate;
    logger.info(`ℹ️  Default template already exists: ${templateName}`);
  }

  // Create/update settings with proper defaults
  const settings = [
    {
      key: 'defaultTemplateId',
      value: defaultTemplate.id
    },
    {
      key: 'sendTime',
      value: '07:00' // Default to 7:00 AM
    },
    {
      key: 'timezone',
      value: 'Africa/Lagos' // Default timezone
    },
    {
      key: 'cronTime',
      value: '07:00' // Same as sendTime - 7:00 AM in selected timezone
    },
    {
      key: 'companyName',
      value: 'Mailer8' // Default company name
    }
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });

    logger.info(`✅ Set setting: ${setting.key} = ${setting.value}`);
  }

  logger.info('🎉 Database seed completed successfully!');
  logger.info(`\n📋 Seed Summary:`);
  logger.info(`   👤 Admin User: ${adminEmail} / ${adminPassword}`);
  logger.info(`   📧 Default Template: ${templateName}`);
  logger.info(`   ⚙️  Default Settings:`);
  logger.info(`      • Send Time: 07:00 (7:00 AM)`);
  logger.info(`      • Timezone: Africa/Lagos`);
  logger.info(`      • Cron Time: 07:00 (same as send time)`);
  logger.info(`      • Company: Mailer8`);
  logger.info(`      • Template: ${defaultTemplate.id}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });