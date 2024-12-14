import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Advert } from "./advert.model";

@Table({
    tableName: 'advert_images',
    timestamps: true,
    createdAt: 'uploaded_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
})

export class AdvertImage extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: uuidv4()
    })
    id: string;

    @ForeignKey(() => Advert)
    @Column({
        allowNull: false,
        type: DataType.UUID
    })
    advert_id: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(100)
    })
    file_path: string;

    @BelongsTo(() => Advert)
    advert: Advert;
}