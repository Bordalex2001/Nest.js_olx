import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Advert } from "src/advert/models/advert.model";
import { User } from "src/auth/models/user.model";
import { v4 as uuidv4 } from "uuid";

@Table({
    tableName: 'messages',
    timestamps: true,
    createdAt: 'sended_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
})

export class Message extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: uuidv4(),
    })
    id: string;

    @ForeignKey(() => Advert)
    @Column({
        allowNull: false,
        type: DataType.UUID
    })
    advert_id: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.UUID
    })
    sender_id: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.UUID
    })
    receiver_id: string;

    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    content: string;

    @BelongsTo(() => User)
    user: User;
}