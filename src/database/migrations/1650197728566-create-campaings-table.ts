import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey } from 'typeorm';

import { CampaignStatus, CampaignType } from '../../constants';

export class CreateCampaingsTable1650197728566 implements MigrationInterface {
  name = 'CreateCampaingsTable1650197728566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'campaigns',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'project_id',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'publish_at',
            type: 'timestamp',
          },
          {
            name: 'type_chain',
            type: 'varchar',
          },
          {
            name: 'token_address',
            type: 'varchar',
          },
          {
            name: 'total_token',
            type: 'int',
          },
          {
            name: 'photo',
            type: 'varchar',
          },
          {
            name: 'logo',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              CampaignType.RANDOM,
              CampaignType.STAGE2STAGE,
              CampaignType.STANDARD,
            ],
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              CampaignStatus.DRAFT,
              CampaignStatus.DOING,
              CampaignStatus.PENDING,
              CampaignStatus.FINISHED,
            ],
          },
          {
            name: 'stage',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'token_per_stage',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'stage_length',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'start_time',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'end_time',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'user_reward',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'mapping_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'campaigns',
      new TableForeignKey({
        columnNames: ['project_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'campaigns',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('campaigns');

    if (table) {
      let foreignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('user_id'),
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey('campaigns', foreignKey);
      }

      foreignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('project_id'),
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey('campaigns', foreignKey);
      }
    }

    await queryRunner.dropTable('campaigns');
  }
}
