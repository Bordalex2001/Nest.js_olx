import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/auth/models/user.model";

@Table({
    tableName: "tokens",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
})
export class Token extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
    })
    user_id: number;

    @Column({
        allowNull: false,
        unique: true
    })
    refresh_token: string;
    
    @Column({
        allowNull: false,
        type: DataTypes.DATE
    })
    expires_at: Date;

    @BelongsTo(() => User)
    user: User;
}