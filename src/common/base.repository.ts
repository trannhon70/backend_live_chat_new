import { DataSource } from 'typeorm';

export class BaseRepository<T> {
    constructor(
        protected readonly dataSource: DataSource,
        protected readonly tableName: string,
    ) { }

    async findAll(): Promise<T[]> {
        return this.dataSource.query(`SELECT * FROM ${this.tableName}`);
    }

    async findById(id: number): Promise<T | null> {
        const result = await this.dataSource.query(
            `SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1`,
            [id],
        );
        return result[0] || null;
    }

    async create(data: Partial<T>): Promise<T> {
        const keys = Object.keys(data);
        const values = Object.values(data);

        const columns = keys.join(', ');
        const params = keys.map((_, i) => `$${i + 1}`).join(', ');

        const result = await this.dataSource.query(
            `INSERT INTO ${this.tableName} (${columns}) VALUES (${params}) RETURNING *`,
            values,
        );

        return result[0];
    }

    async update(id: number, data: Partial<T>): Promise<T> {
        const keys = Object.keys(data);
        const values = Object.values(data);

        const setQuery = keys
            .map((key, i) => `${key} = $${i + 1}`)
            .join(', ');

        const result = await this.dataSource.query(
            `UPDATE ${this.tableName} SET ${setQuery} WHERE id = $${keys.length + 1
            } RETURNING *`,
            [...values, id],
        );

        return result[0];
    }

    async delete(id: number): Promise<void> {
        await this.dataSource.query(
            `DELETE FROM ${this.tableName} WHERE id = $1`,
            [id],
        );
    }
}