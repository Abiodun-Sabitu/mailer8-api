import { EmailTemplate, Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { parsePagination, createPaginatedResponse, PaginatedResponse } from '../../utils/pagination';
import { CreateTemplateDto, UpdateTemplateDto, GetTemplatesQueryDto } from './templates.schemas';

export const createTemplate = async (data: CreateTemplateDto, createdBy: string): Promise<EmailTemplate> => {
  const template = await prisma.emailTemplate.create({
    data: {
      name: data.name,
      subject: data.subject,
      body: data.body,
      createdBy,
      isActive: true
    }
  });

  return template;
};

export const getTemplates = async (query: GetTemplatesQueryDto): Promise<PaginatedResponse<EmailTemplate>> => {
  const pagination = parsePagination({ page: query.page, limit: query.limit });
  
  // Build where clause
  const where: Prisma.EmailTemplateWhereInput = {};
  
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { subject: { contains: query.search, mode: 'insensitive' } }
    ];
  }
  
  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  // Get templates with pagination
  const [templates, total] = await Promise.all([
    prisma.emailTemplate.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    }),
    prisma.emailTemplate.count({ where })
  ]);

  return createPaginatedResponse(templates, total, pagination);
};

export const getTemplateById = async (id: string): Promise<EmailTemplate | null> => {
  const template = await prisma.emailTemplate.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

  return template;
};

export const updateTemplate = async (id: string, data: UpdateTemplateDto): Promise<EmailTemplate> => {
  const updateData: Prisma.EmailTemplateUpdateInput = {};
  
  if (data.name) updateData.name = data.name;
  if (data.subject) updateData.subject = data.subject;
  if (data.body) updateData.body = data.body;

  const template = await prisma.emailTemplate.update({
    where: { id },
    data: updateData,
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

  return template;
};

export const deleteTemplate = async (id: string): Promise<void> => {
  // Check if this template is set as default
  const defaultTemplateSetting = await prisma.setting.findUnique({
    where: { key: 'defaultTemplateId' }
  });

  if (defaultTemplateSetting?.value === id) {
    throw new Error('Cannot delete template that is set as default. Please set another template as default first.');
  }

  await prisma.emailTemplate.delete({
    where: { id }
  });
};

export const getActiveTemplates = async (): Promise<EmailTemplate[]> => {
  const templates = await prisma.emailTemplate.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  return templates;
};