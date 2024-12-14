import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/auth/models/user.model";
import { v4 as uuidv4 } from "uuid";
import { AdvertImage } from "./advert-image.model";
import { Message } from "src/message/message.model";
import { Category } from "src/category/category.model";

enum AdvertStatus{
    ACTIVE = 'active',
    SOLD = 'sold'
}

@Table({
    tableName: 'adverts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    scopes: {
        isActive: {
            where: { status: AdvertStatus.ACTIVE },
        },
        isSold: {
            where: { status: AdvertStatus.SOLD }
        }
    }
})

export class Advert extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: uuidv4(),
    })
    id: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.UUID
    })
    user_id: number;

    @Column({
        allowNull: false,
        type: DataType.STRING(100)
    })
    title: string;

    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    description: string;

    @ForeignKey(() => Category)
    @Column({
        allowNull: false,
        type: DataType.UUID
    })
    category_id: string;

    @Column({
        allowNull: false,
        type: DataType.DECIMAL
    })
    price: number

    @Column({
        allowNull: false,
        defaultValue: AdvertStatus.ACTIVE,
        type: DataType.ENUM(...Object.values(AdvertStatus))
    })
    status: AdvertStatus

    @Column({
        allowNull: false,
        defaultValue: 0,
        type: DataType.BIGINT
    })
    views: number

    @HasMany(() => AdvertImage)
    advert_images: AdvertImage[];

    @HasMany(() => Message)
    messages: Message[];
}