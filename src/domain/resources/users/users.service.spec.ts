import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestError } from 'src/domain/errors/bad-request.error';
import { ConflictError } from 'src/domain/errors/conflict.error';
import { NotFoundError } from 'src/domain/errors/not-found.error';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { Repository } from 'typeorm';
import { Company } from '../companies/company.model';
import { User } from './user.model';
import { UsersService } from './users.service';

class PgUniqueViolationError extends Error {
  code: string;

  constructor() {
    super();
    this.code = '23505';
  }
}

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: DeepMocked<Repository<User>>;
  let companyRepository: DeepMocked<Repository<Company>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: getRepositoryToken(Company),
          useValue: createMock<Repository<Company>>(),
        },
        {
          provide: HashingService,
          useValue: createMock<BcryptService>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<DeepMocked<Repository<User>>>(
      getRepositoryToken(User),
    );
    companyRepository = module.get<DeepMocked<Repository<Company>>>(
      getRepositoryToken(Company),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    describe('when user exists', () => {
      it('should return the user', async () => {
        const userId = '88087b34-07b0-4374-a9af-24b6cbb94466';
        const expectedUser = new User();

        userRepository.findOne.mockReturnValue(Promise.resolve(expectedUser));

        const user = await service.get(userId);
        expect(user).toEqual(expectedUser);
      });
    });
    describe('otherwise', () => {
      it('should throw a "NotFoundError" error', async () => {
        const userId = '88087b34-07b0-4374-a9af-24b6cbb94466';

        userRepository.findOne.mockReturnValue(Promise.resolve(undefined));

        try {
          await service.get(userId);
          expect(false).toBeTruthy();
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundError);
          expect(err.message).toEqual('User not found');
        }
      });
    });
  });

  describe('list', () => {
    it('should return all users', async () => {
      const queryParams = {};
      const expectedUsers = [new User(), new User()];

      userRepository.find.mockReturnValue(Promise.resolve(expectedUsers));

      const users = await service.list(queryParams);
      expect(users).toEqual(expectedUsers);
    });
  });

  describe('create', () => {
    describe('when user company does not exist if supplied', () => {
      it('should throw a "BadRequestError" error', async () => {
        const createUserDto = {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          companyId: '84c9bb5e-b520-45a2-8c1a-bf763c20470f',
        };
        const existingCompany = null;

        companyRepository.findOneBy.mockReturnValue(
          Promise.resolve(existingCompany),
        );

        try {
          await service.create(createUserDto);
          expect(false).toBeTruthy();
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestError);
          expect(err.message).toEqual('Company does not exist');
        }
      });
    });
    describe('when user already exists', () => {
      it('should throw a "ConflictError" error', async () => {
        const createUserDto = {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
        };

        userRepository.save.mockRejectedValue(new PgUniqueViolationError());

        try {
          await service.create(createUserDto);
          expect(false).toBeTruthy();
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictError);
          expect(err.message).toEqual('User already exists');
        }
      });
    });
    describe('otherwise', () => {
      it('should create a user', async () => {
        const createUserDto = {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          companyId: '',
        };
        const existingUser = null;
        const existingCompany = new Company();
        const createdUser = new User();

        userRepository.findOneBy.mockReturnValue(Promise.resolve(existingUser));
        companyRepository.findOneBy.mockReturnValue(
          Promise.resolve(existingCompany),
        );
        userRepository.save.mockReturnValue(Promise.resolve(createdUser));

        const user = await service.create(createUserDto);
        expect(user).toEqual(createdUser);
      });
    });
  });

  describe('update', () => {
    describe('when user does not exist', () => {
      it('should throw a "NotFoundError" error', async () => {
        const userId = '88087b34-07b0-4374-a9af-24b6cbb94466';
        const updateUserDto = {};
        const existingUser = null;

        userRepository.preload.mockReturnValue(Promise.resolve(existingUser));

        try {
          await service.update(userId, updateUserDto);
          expect(false).toBeTruthy();
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundError);
          expect(err.message).toEqual('User not found');
        }
      });
    });
    describe('when user company does not exist if supplied', () => {
      it('should throw a "BadRequestError" error', async () => {
        const userId = '88087b34-07b0-4374-a9af-24b6cbb94466';
        const companyId = '84c9bb5e-b520-45a2-8c1a-bf763c20470f';
        const updateUserDto = {
          companyId,
        };
        const existingUser = new User();
        const existingCompany = null;

        userRepository.preload.mockReturnValue(Promise.resolve(existingUser));
        companyRepository.findOneBy.mockReturnValue(
          Promise.resolve(existingCompany),
        );

        try {
          await service.update(userId, updateUserDto);
          expect(false).toBeTruthy();
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestError);
          expect(err.message).toEqual('Company does not exist');
        }
      });
    });
    describe('otherwise', () => {
      it('should udpate a user', async () => {
        const userId = '88087b34-07b0-4374-a9af-24b6cbb94466';
        const companyId = '84c9bb5e-b520-45a2-8c1a-bf763c20470f';
        const updateUserDto = {
          companyId,
        };
        const existingUser = new User();
        const existingCompany = new Company();
        const updatedUser = new User();

        userRepository.preload.mockReturnValue(Promise.resolve(existingUser));
        companyRepository.findOneBy.mockReturnValue(
          Promise.resolve(existingCompany),
        );
        userRepository.save.mockReturnValue(Promise.resolve(updatedUser));

        const user = await service.update(userId, updateUserDto);
        expect(user).toEqual(updatedUser);
      });
    });
  });

  describe('delete', () => {
    describe('when user exists', () => {
      it('should return the deleted user', async () => {
        const userId = '88087b34-07b0-4374-a9af-24b6cbb94466';
        const existingUser = new User();
        const deletedUser = new User();

        userRepository.findOneBy.mockReturnValue(Promise.resolve(existingUser));
        userRepository.remove.mockReturnValue(Promise.resolve(deletedUser));

        const user = await service.delete(userId);
        expect(user).toEqual(deletedUser);
      });
    });
    describe('otherwise', () => {
      it('should throw a "NotFoundError" error', async () => {
        const userId = '88087b34-07b0-4374-a9af-24b6cbb94466';
        const existingUser = null;

        userRepository.findOneBy.mockReturnValue(Promise.resolve(existingUser));

        try {
          await service.delete(userId);
          expect(false).toBeTruthy();
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundError);
          expect(err.message).toEqual('User not found');
        }
      });
    });
  });
});
