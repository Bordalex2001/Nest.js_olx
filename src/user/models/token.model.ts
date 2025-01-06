import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/user/models/user.model";

@Table({
    tableName: "tokens",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
})
export class Token extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: uuidv4()
    })
    id: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.UUID
    })
    user_id: string;

    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING
    })
    refresh_token: string;
    
    @Column({
        allowNull: false,
        type: DataType.DATE
    })
    expires_at: Date;

    @BelongsTo(() => User)
    user: User;
}