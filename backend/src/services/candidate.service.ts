import { Candidate, ICandidate } from '../models/Candidate';
import { logger } from '../utils/logger';

export class CandidateService {
  
  async create(candidateData: Partial<ICandidate>): Promise<ICandidate> {
    logger.info({ action: 'CREATE_CANDIDATE_START', data: candidateData.email });
    
    const existing = await Candidate.findOne({ email: candidateData.email });
    if (existing && !existing.deletedAt) {
      throw new Error('Candidate with this email already exists');
    }
    
    const candidate = new Candidate(candidateData);
    await candidate.save();
    
    logger.info({ action: 'CREATE_CANDIDATE_SUCCESS', id: candidate._id });
    return candidate;
  }
  
  async findById(id: string): Promise<ICandidate | null> {
    return await Candidate.findById(id);
  }
  
  async update(id: string, updates: Partial<ICandidate>): Promise<ICandidate | null> {
    return await Candidate.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
  }
  
  async softDelete(id: string): Promise<boolean> {
    const result = await Candidate.findByIdAndUpdate(id, { 
      deletedAt: new Date() 
    });
    return !!result;
  }
  
  async validateAsync(id: string): Promise<ICandidate | null> {
    logger.info({ action: 'VALIDATION_START', id });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { isValidated: true },
      { new: true }
    );
    
    logger.info({ action: 'VALIDATION_END', id, success: !!candidate });
    return candidate;
  }
  
  async findAll(filters?: any, page = 1, limit = 10): Promise<{ data: ICandidate[]; total: number }> {
    const query: any = {};
    
    if (filters?.position) query.position = filters.position;
    if (filters?.experience) query.experience = { $gte: filters.experience };
    
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Candidate.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Candidate.countDocuments(query)
    ]);
    
    return { data, total };
  }
}
