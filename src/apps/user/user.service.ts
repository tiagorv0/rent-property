import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithoutPassword } from 'src/@types/types';
import { UpdateUserDto } from './dto/update-user.dto';
import ChangePasswordDto from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const user = CreateUserDto.toUser(createUserDto);
    await user.setPassword(createUserDto.password);

    const savedUser = await this.userModel.create(user);
    const { password, ...result } = savedUser.toObject();
    return result as UserWithoutPassword;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword | null> {
    if (updateUserDto.username) {
      const existingUser = await this.userModel
        .findOne({
          username: updateUserDto.username,
          _id: { $ne: id },
        })
        .lean()
        .exec();

      if (existingUser) {
        throw new BadRequestException('Username já cadastrado');
      }
    }

    const updated = await this.userModel
      .findOneAndUpdate({ _id: id }, updateUserDto, { new: true })
      .select('-password')
      .lean()
      .exec();

    if (!updated) throw new NotFoundException('Usuário não encontrado');

    return updated as UserWithoutPassword;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username }).lean().exec();
  }

  async getUsers(): Promise<UserWithoutPassword[]> {
    return (await this.userModel
      .find()
      .select('-password')
      .lean()
      .exec()) as UserWithoutPassword[];
  }

  async getUserById(id: string): Promise<UserWithoutPassword | null> {
    return (await this.userModel
      .findById(id)
      .select('-password')
      .lean()
      .exec()) as UserWithoutPassword;
  }

  async removeUser(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await user.setPassword(changePasswordDto.password);
    await user.save();
  }
}
