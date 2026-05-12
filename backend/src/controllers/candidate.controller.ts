import { Request, Response } from 'express';
import { CandidateService } from '../services/candidate.service';
import { validateCandidate } from '../utils/validation';

const candidateService = new CandidateService();

export class CandidateController {
  
  async create(req: Request, res: Response) {
    const validation = validateCandidate(req.body);
    
    if (validation.error) {
      return res.status(400).json({ errors: validation.error });
    }
    
    try {
      const candidate = await candidateService.create(req.body);
      res.status(201).json(candidate);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
  
  async getById(req: Request, res: Response) {
    try {
      // Convertir l'ID en string explicite
      const id = req.params.id as string;
      const candidate = await candidateService.findById(id);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      res.json(candidate);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const candidate = await candidateService.update(id, req.body);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      res.json(candidate);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
  
  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const deleted = await candidateService.softDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async validate(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const candidate = await candidateService.validateAsync(id);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      res.json({ message: 'Validation started', candidate });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        position: req.query.position as string,
        experience: parseInt(req.query.experience as string)
      };
      
      const result = await candidateService.findAll(filters, page, limit);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}