import { IpStatus } from "src/common/enums";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('block_ip')
export class BlockIp {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column({ nullable: true })
    name!: string;

    @Column({
        type: 'enum',
        enum: IpStatus,
        default: IpStatus.IP,
        nullable: true, // nếu muốn cho phép null
    })
    status!: IpStatus;

    //Người tạo
    @Column({ nullable: true })
    user_id!: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ nullable: true })
    created_at!: number;
}
