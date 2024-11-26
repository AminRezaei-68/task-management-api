import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from 'supertest';
import { TasksModule } from "src/tasks/tasks.module";
import { CreateTaskDto } from "src/tasks/dto/create-task.dto";


describe('[Feature] Tasks - /tasks', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TasksModule,
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5433,
                    username: 'postgres',
                    password: '12345',
                    database: 'postgres',
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            }),
        );
        await app.init();
    });

    it('Create [POST /]', () => {
        return request(app.getHttpServer())
        .post('/tasks')
        .send(task as CreateTaskDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
            const expectedTask = expect.objectContaining({
                ...Task,
                
            })
        });
    });

    it.todo('Get all [GET /]');
    it.todo('Get one [GET /:id]');
    it.todo('Update one [PATCH /:id]');
    it.todo('Delete one [DELETE /:id]');
    
    afterAll(async () => {
        await app.close();
    });
});