import DBServices from "../DBServices/DBConnection";
import ServiceHistory from "./ServiceHistory/ServiceHistory";
import JobCard from "./JobCard/JobCard";

const db_connection_instane: DBServices = new DBServices();

// Defer addModels call - it will be called when getSequelizeInstance() is first accessed
// This ensures environment variables are loaded before Sequelize initialization
let modelsInitialized = false;
const initializeModels = () => {
  if (!modelsInitialized) {
    db_connection_instane
      .getSequelizeInstance()
      .addModels([ServiceHistory, JobCard]);
    modelsInitialized = true;
  }
};

// Initialize models lazily when getSequelizeInstance is first called
// This happens in createDBConnection() which is called after env vars are loaded
export { db_connection_instane, ServiceHistory, JobCard, initializeModels };
