import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Advert } from "src/advert/models/advert.model";
import { Message } from "src/message/message.model";
import { v4 as uuidv4 } from "uuid";
import { Token } from "./token.model";

export enum UserRole{
    ADMIN = 'admin',
    BUYER = 'buyer',
    SELLER = 'seller',
    GUEST = 'guest'
}

@Table({
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    scopes: {
        admins: {
            where: { role: UserRole.ADMIN }
        },
        buyers: {
            where: { role: UserRole.BUYER }
        },
        sellers: {
            where: { role: UserRole.SELLER }
        },
        guests: {
            where: { role: UserRole.GUEST }
        }
    }
})

export class User extends Model {
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
    first_name: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(50)
    })
    last_name: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(320)
    })
    email: string;

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    password: string;
    
    @Column({
        allowNull: false,
        defaultValue: UserRole.GUEST,
        type: DataType.ENUM(...Object.values(UserRole))
    })
    role: UserRole;

    @Column({
        allowNull: false,
        type: DataType.STRING(20)
    })
    phone_number: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT
    })
    about_user: string;

    /*@Column({ 
        type: DataType.STRING, 
        allowNull: true 
    })
    reset_token: string;*/

    /*@Column({ 
        type: DataType.DATE, 
        allowNull: true 
    })
    reset_token_expires: Date;*/

    @HasMany(() => Advert)
    adverts: Advert[];

    @HasMany(() => Message)
    messages: Message[];

    @HasMany(() => Token)
    tokens: Token[];
}