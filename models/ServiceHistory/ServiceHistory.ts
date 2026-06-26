import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";

@Table({ timestamps: false, tableName: "service_history", freezeTableName: true })
export default class ServiceHistory extends Model<ServiceHistory> {
  @Column({ primaryKey: true, type: DataType.BIGINT, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  declare job_card_id: number;

  // Denormalised user identifiers so service history can be queried directly
  // by car registration or client mobile without joining job_card.
  @Column({ type: DataType.STRING(20), allowNull: false })
  declare car_registration: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare client_mobile: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare service_type: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare description: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare amount: number;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare service_date: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare odometer: number;

  @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: Date.now() })
  declare created_at: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  declare updated_at: number;

  @BeforeCreate
  static addCreatedAt(instance: ServiceHistory) {
    instance.created_at = Date.now();
  }

  @BeforeUpdate
  static addUpdatedAt(instance: ServiceHistory) {
    instance.updated_at = Date.now();
  }
}
