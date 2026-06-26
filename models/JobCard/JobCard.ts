import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";

@Table({ timestamps: false, tableName: "job_card", freezeTableName: true })
export default class JobCard extends Model<JobCard> {
  @Column({ primaryKey: true, type: DataType.BIGINT, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare job_card_id: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare car_registration: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare client_mobile: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare customer_name: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare car_vin: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare total_amount: number;

  @Column({
    type: DataType.ENUM("Open", "In-Progress", "Completed", "Disputed", "Corrected"),
    allowNull: false,
    defaultValue: "Open",
  })
  declare status: "Open" | "In-Progress" | "Completed" | "Disputed" | "Corrected";

  @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: Date.now() })
  declare created_at: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  declare updated_at: number;

  @BeforeCreate
  static addCreatedAt(instance: JobCard) {
    instance.created_at = Date.now();
  }

  @BeforeUpdate
  static addUpdatedAt(instance: JobCard) {
    instance.updated_at = Date.now();
  }
}
