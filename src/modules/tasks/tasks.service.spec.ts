import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './schemas/task.schema';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { title } from 'process';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useClass: Repository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  describe('findAll', () => {
    it('should return an arry of tasks', async () => {
      const paginationQuery = { limit: 10, offset: 5 };
      const result = [{ id: 1, title: 'Test Task', description: 'Test' }];
      jest.spyOn(repository, 'find').mockResolvedValue(result as any);

      const tasks = await service.findAll(paginationQuery);
      expect(tasks).toBe(result);
    });
  });

  describe('findOne', () => {
    expect(service).toBeDefined();
  });
});
