// import { Message } from 'src/message/entities/message.entity';
import { Label } from 'src/labels/entities/label.entity';
import { LiveMessage } from 'src/live_message/entities/live_message.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

//cuộc trò chuyện giữa 2 người
@Entity('conversation')
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    // Người dùng có thể không có tài khoản → lưu IP
    @Column({ nullable: true })
    customerIp: string;

    // Nhân viên đảm nhận chat
    @Column({ name: 'assigned_user_id', nullable: true })
    assignedUserId: number | null;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assigned_user_id' })
    assignedUser: User | null;

    // Label
    @Column({ name: 'label_id', nullable: true })
    labelId: number | null;

    @ManyToOne(() => Label, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'label_id' })
    label: Label | null;

    // 💬 messages
    @OneToMany(() => LiveMessage, (message) => message.conversation)
    messages: LiveMessage[];

    //nếu khách hàng gửi -> lưu id máy tính và trình duyệt
    @Column({ nullable: true, default: '' })
    idComputer: string;


    //Chuỗi User-Agent gốc từ trình duyệt hoặc thiết bị client gửi lên.
    @Column({ type: 'text', nullable: true })
    userAgent: string;

    //Tên trình duyệt mà client đang sử dụng.
    @Column({ type: 'text', nullable: true })
    browser: string;

    //Hệ điều hành của thiết bị client.
    @Column({ nullable: true, default: '' })
    os: string;

    //loại thiết bị đang sử dụng
    @Column({ nullable: true, default: '' })
    device: string;

    //loại thiết bị đang sử dụng
    @Column({ nullable: true, default: false })
    online: boolean;


    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    region: string;

    @Column({ nullable: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    url: string;

    //Địa chỉ khi user chấp nhận xác định vị trí
    @Column({ type: 'text', nullable: true })
    address: string;

    //mã hóa của analytics để xác định lượt truy cập quảng cáo 
    @Column({ type: 'varchar', nullable: true })
    gclid: string;

    //bot google thả vào
    @Column({ type: 'text', nullable: true })
    bot: string;

    //thời gian tạo
    @Column()
    created_at: number;
}