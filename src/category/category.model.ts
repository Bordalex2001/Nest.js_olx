import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Advert } from "src/advert/models/advert.model";
import { v4 as uuidv4 } from "uuid";

@Table({
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
})

export class Category extends Model{
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: uuidv4(),
    })
    id: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(50)
    })
    name: string;

    @ForeignKey(() => Category)
    @Column({
        allowNull: true,
        type: DataType.UUID
    })
    parent_category_id: string;

    @HasMany(() => Category, 'parent_category_id')
    subcategories: Category[];

    @HasMany(() => Advert)
    adverts: Advert[];
}