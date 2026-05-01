import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HeyamaObject, ObjectDocument } from './object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { StorageService } from '../storage/storage.service';
import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(HeyamaObject.name) private objectModel: Model<ObjectDocument>,
    private storageService: StorageService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(dto: CreateObjectDto, file: Express.Multer.File): Promise<ObjectDocument> {
    let uploadResult: { url: string; key: string } | null = null;
    try {
      uploadResult = await this.storageService.uploadFile(file);

      const obj = new this.objectModel({
        title: dto.title,
        description: dto.description,
        imageUrl: uploadResult.url,
        imageKey: uploadResult.key,
      });

      const saved = await obj.save();
      this.eventsGateway.emitNewObject(saved.toJSON());
      return saved;
    } catch (error) {
      if (uploadResult?.key) {
        await this.storageService.deleteFile(uploadResult.key).catch(() => {});
      }
      throw error;
    }
  }

  async findAll(): Promise<ObjectDocument[]> {
    return this.objectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ObjectDocument> {
    try {
      const obj = await this.objectModel.findById(id).exec();
      if (!obj) throw new NotFoundException(`Object #${id} not found`);
      return obj;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new NotFoundException(`Invalid ID or object #${id} not found`);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const obj = await this.objectModel.findById(id).exec();
      if (!obj) throw new NotFoundException(`Object #${id} not found`);

      if (obj.imageKey) {
        await this.storageService.deleteFile(obj.imageKey).catch(err => {
          console.warn(`Failed to delete file for object ${id}:`, err.message);
        });
      }

      await this.objectModel.findByIdAndDelete(id).exec();
      this.eventsGateway.emitDeleteObject(id);
      return { message: 'Object deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error(`Failed to delete object: ${error.message}`);
    }
  }
}
