import { Role } from 'src/roles/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

    //Chức vụ
    @Column()
    roleId: number;
    @ManyToOne(() => Role, (role) => role.id)
    role: Role;

    //email
    @Column({ nullable: true })
    email: string

    //mật khẩu
    @Column({ nullable: true })
    password: string;

    //tên user
    @Column({ nullable: true })
    fullName: string;

    //ngày sinh
    @Column({ nullable: true })
    ngaySinh: string;

    //Số điện thoại
    @Column({ nullable: true })
    phone: string;


    // 0 là đã khóa, 1 chưa khóa
    @Column({ default: true })
    delete: boolean;

    @Column({ type: 'boolean', nullable: true })
    online: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatar: string;

    //tỉ lệ nhận chat
    @Column({ default: 1 })
    quantity: number;

    //thứ tự nhận chat
    @Column({ default: 0 })
    order: number;

    //thời gian tạo
    @Column()
    created_at: number;
}