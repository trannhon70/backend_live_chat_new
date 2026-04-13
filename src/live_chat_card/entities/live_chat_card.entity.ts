import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('live_chat_card')
export class LiveChatCard {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', nullable: true  })
    name: string;

    //Người tạo
    @Column({ nullable: true })
    user_id!: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user!: User;
    //thời gian tạo
    @Column()
    created_at: number;
}
