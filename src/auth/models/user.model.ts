import { Column, Model, Table } from "sequelize-typescript";

enum UserRole{
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
        autoIncrement: true
    })
    id: number;

    @Column({
        allowNull: false
    })
    first_name: string;

    @Column({
        allowNull: false
    })
    last_name: string;

    @Column({
        allowNull: false
    })
    email: string;

    @Column({
        allowNull: false
    })
    password: string;
    
    @Column({
        allowNull: false,
        defaultValue: UserRole.GUEST
    })
    role: UserRole;

    @Column({
        allowNull: false
    })
    phone_number: string;

    @Column({
        allowNull: true
    })
    location: string;

    @Column({
        allowNull: true
    })
    about_user: string;
}