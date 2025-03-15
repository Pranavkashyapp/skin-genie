import { 
    users, 
    type User, 
    type InsertUser,
    skinConditions,
    type SkinCondition,
    type InsertSkinCondition,
    treatments,
    type Treatment,
    type InsertTreatment,
    conditionTreatments,
    type ConditionTreatment,
    type InsertConditionTreatment
  } from "@shared/schema";
  
  // Storage interface
  export interface IStorage {
    // User methods
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
    
    // Skin condition methods
    getSkinCondition(id: number): Promise<SkinCondition | undefined>;
    getAllSkinConditions(): Promise<SkinCondition[]>;
    createSkinCondition(condition: InsertSkinCondition): Promise<SkinCondition>;
    
    // Treatment methods
    getTreatment(id: number): Promise<Treatment | undefined>;
    getAllTreatments(): Promise<Treatment[]>;
    createTreatment(treatment: InsertTreatment): Promise<Treatment>;
    
    // Relationship methods
    getConditionTreatment(id: number): Promise<ConditionTreatment | undefined>;
    getConditionTreatmentsByCondition(conditionId: number): Promise<ConditionTreatment[]>;
    createConditionTreatment(conditionTreatment: InsertConditionTreatment): Promise<ConditionTreatment>;
    getTreatmentsForCondition(conditionId: number): Promise<Treatment[]>;
  }
  
  export class MemStorage implements IStorage {
    private users: Map<number, User>;
    private skinConditions: Map<number, SkinCondition>;
    private treatments: Map<number, Treatment>;
    private conditionTreatments: Map<number, ConditionTreatment>;
    
    private userCurrentId: number;
    private conditionCurrentId: number;
    private treatmentCurrentId: number;
    private relationshipCurrentId: number;
  
    constructor() {
      this.users = new Map();
      this.skinConditions = new Map();
      this.treatments = new Map();
      this.conditionTreatments = new Map();
      
      this.userCurrentId = 1;
      this.conditionCurrentId = 1;
      this.treatmentCurrentId = 1;
      this.relationshipCurrentId = 1;
      
      // Initialize with some common skin conditions
      this.seedSkinConditions();
      this.seedTreatments();
      this.seedConditionTreatments();
    }
  
    // User methods
    async getUser(id: number): Promise<User | undefined> {
      return this.users.get(id);
    }
  
    async getUserByUsername(username: string): Promise<User | undefined> {
      return Array.from(this.users.values()).find(
        (user) => user.username === username,
      );
    }
  
    async createUser(insertUser: InsertUser): Promise<User> {
      const id = this.userCurrentId++;
      const user: User = { ...insertUser, id };
      this.users.set(id, user);
      return user;
    }
    
    // Skin condition methods
    async getSkinCondition(id: number): Promise<SkinCondition | undefined> {
      return this.skinConditions.get(id);
    }
    
    async getAllSkinConditions(): Promise<SkinCondition[]> {
      return Array.from(this.skinConditions.values());
    }
    
    async createSkinCondition(insertCondition: InsertSkinCondition): Promise<SkinCondition> {
      const id = this.conditionCurrentId++;
      const condition: SkinCondition = { ...insertCondition, id };
      this.skinConditions.set(id, condition);
      return condition;
    }
    
    // Treatment methods
    async getTreatment(id: number): Promise<Treatment | undefined> {
      return this.treatments.get(id);
    }
    
    async getAllTreatments(): Promise<Treatment[]> {
      return Array.from(this.treatments.values());
    }
    
    async createTreatment(insertTreatment: InsertTreatment): Promise<Treatment> {
      const id = this.treatmentCurrentId++;
      const treatment: Treatment = { ...insertTreatment, id };
      this.treatments.set(id, treatment);
      return treatment;
    }
    
    // Relationship methods
    async getConditionTreatment(id: number): Promise<ConditionTreatment | undefined> {
      return this.conditionTreatments.get(id);
    }
    
    async getConditionTreatmentsByCondition(conditionId: number): Promise<ConditionTreatment[]> {
      return Array.from(this.conditionTreatments.values()).filter(
        ct => ct.conditionId === conditionId
      );
    }
    
    async createConditionTreatment(insertRelationship: InsertConditionTreatment): Promise<ConditionTreatment> {
      const id = this.relationshipCurrentId++;
      const relationship: ConditionTreatment = { ...insertRelationship, id };
      this.conditionTreatments.set(id, relationship);
      return relationship;
    }
    
    async getTreatmentsForCondition(conditionId: number): Promise<Treatment[]> {
      const relationships = await this.getConditionTreatmentsByCondition(conditionId);
      const treatmentIds = relationships.map(rel => rel.treatmentId);
      return (await this.getAllTreatments()).filter(
        treatment => treatmentIds.includes(treatment.id)
      );
    }
    
    // Seed methods to populate initial data
    private seedSkinConditions() {
      const conditions: InsertSkinCondition[] = [
        {
          name: "Acne Vulgaris",
          description: "Inflammatory condition of the skin characterized by pimples, blackheads, and whiteheads.",
          symptoms: "Pimples, blackheads, whiteheads, redness, and inflammation.",
          severity: "mild",
          commonLocations: "face, chest, back"
        },
        {
          name: "Eczema",
          description: "Chronic inflammatory skin condition causing dry, itchy skin.",
          symptoms: "Dry, itchy, red, and inflamed skin. May have small bumps or blisters.",
          severity: "moderate",
          commonLocations: "elbows, knees, neck, hands"
        },
        {
          name: "Psoriasis",
          description: "Autoimmune condition causing rapid skin cell growth leading to thick, scaly patches.",
          symptoms: "Thick, red patches of skin covered with silvery scales.",
          severity: "severe",
          commonLocations: "elbows, knees, scalp, lower back"
        },
        {
          name: "Rosacea",
          description: "Chronic inflammatory condition causing facial redness and visible blood vessels.",
          symptoms: "Facial redness, visible blood vessels, and sometimes small, red bumps.",
          severity: "moderate",
          commonLocations: "cheeks, nose, forehead, chin"
        },
        {
          name: "Dry Skin",
          description: "Skin condition characterized by lack of moisture in the skin.",
          symptoms: "Rough, flaky, or scaly skin. May cause itching.",
          severity: "mild",
          commonLocations: "face, arms, legs"
        }
      ];
      
      conditions.forEach(condition => {
        this.createSkinCondition(condition);
      });
    }
    
    private seedTreatments() {
      const treatments: InsertTreatment[] = [
        {
          name: "Benzoyl Peroxide Cleanser",
          description: "Helps kill acne-causing bacteria and reduce inflammation.",
          ingredients: "Benzoyl Peroxide 2.5%-5%",
          recommendationLevel: "high",
          tags: "formulated for sensitive skin,no prescription needed,daily use"
        },
        {
          name: "Salicylic Acid Spot Treatment",
          description: "Helps unclog pores and reduce inflammation when applied directly to acne lesions.",
          ingredients: "Salicylic Acid 1-2%",
          recommendationLevel: "medium",
          tags: "apply only to affected areas,use as needed,over-the-counter"
        },
        {
          name: "Hyaluronic Acid Moisturizer",
          description: "Helps maintain skin hydration without clogging pores.",
          ingredients: "Hyaluronic Acid, Glycerin",
          recommendationLevel: "high",
          tags: "oil-free formula,morning and night application,suitable for all skin types"
        },
        {
          name: "Topical Corticosteroid Cream",
          description: "Reduces inflammation, itching, and redness associated with various skin conditions.",
          ingredients: "Hydrocortisone 0.5-1%",
          recommendationLevel: "medium",
          tags: "short-term use,prescription may be needed for stronger formulations,avoid on face"
        },
        {
          name: "Niacinamide Serum",
          description: "Helps improve skin barrier function, reduce inflammation, and even skin tone.",
          ingredients: "Niacinamide 5-10%",
          recommendationLevel: "high",
          tags: "suitable for most skin types,morning or night application,can be combined with other products"
        }
      ];
      
      treatments.forEach(treatment => {
        this.createTreatment(treatment);
      });
    }
    
    private seedConditionTreatments() {
      const relationships: InsertConditionTreatment[] = [
        { conditionId: 1, treatmentId: 1, efficacy: "high" }, // Acne - Benzoyl Peroxide
        { conditionId: 1, treatmentId: 2, efficacy: "medium" }, // Acne - Salicylic Acid
        { conditionId: 1, treatmentId: 5, efficacy: "medium" }, // Acne - Niacinamide
        { conditionId: 2, treatmentId: 4, efficacy: "high" }, // Eczema - Corticosteroid
        { conditionId: 2, treatmentId: 3, efficacy: "medium" }, // Eczema - Hyaluronic Acid
        { conditionId: 3, treatmentId: 4, efficacy: "medium" }, // Psoriasis - Corticosteroid
        { conditionId: 4, treatmentId: 5, efficacy: "high" }, // Rosacea - Niacinamide
        { conditionId: 5, treatmentId: 3, efficacy: "high" } // Dry Skin - Hyaluronic Acid
      ];
      
      relationships.forEach(relationship => {
        this.createConditionTreatment(relationship);
      });
    }
  }
  
  export const storage = new MemStorage();
  