import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsInt, IsOptional } from 'class-validator';

@Entity('live_chat_logo')
export class LiveChatLogo {
    @IsOptional()
    @IsInt()
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column({ type: 'text', nullable: true })
    file!: string;

    //thời gian tạo
    @Column({ nullable: true })
    created_at!: number;
}
