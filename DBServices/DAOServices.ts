import { DAOInterface} from "./interface";

import { Transaction } from "sequelize";
import { db_connection_instane } from "../models/index";

export default class DaoServices {
  /**
   * Common Find All Query
   * @param modelName - On which Which Model we have to Search
   * @param attributes - Which Attributes we have to Fetch
   * @param where - On which Condition
   * @param transaction - Transaction
   * @returns {Array<DAOInterface>}- FindAll Result
   */
  public findAllDao = async (
    modelName: any,
    attributes: string[],
    where: object,
    transaction?: Transaction
  ): Promise<Array<DAOInterface>> => {
    try {
      return transaction
        ? await modelName.findAll({
            where: where,
            attributes: attributes,
            transaction: transaction,
          })
        : await modelName.findAll({
            where: where,
            attributes: attributes,
          });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * Common Find One Query
   * @param modelName - On which Which Model we have to Search
   * @param attributes - Which Attributes we have to Fetch
   * @param where - On which Condition
   * @param transaction - Transaction
   * @returns {DAOInterface}- FindAll Result
   */
  public findOneDao = async (
    modelName: any,
    attributes: string[],
    where: object,
    transaction?: Transaction
  ): Promise<any> => {
    try {
      return transaction
        ? await modelName.findOne({
            where: where,
            attributes: attributes,
            transaction: transaction,
          })
        : await modelName.findOne({
            where: where,
            attributes: attributes,
          });
    } catch (error) {
      console.error("Error from Dao", error);
      throw error;
    }
  };

  /**
   * Common Find One Query
   * @param modelName - On which Which Model we have to Search
   * @param attributes - Which Attributes we have to Fetch
   * @param where - On which Condition
   * @param transaction - Transaction
   * @returns {DAOInterface}- FindAll Result
   */
  public updateDao = async (
    modelName: any,
    updateAttributes: object,
    where: object,
    transaction?: Transaction
  ): Promise<Array<DAOInterface>> => {
    try {
      return transaction
        ? await modelName.update(updateAttributes, {
            where: where,
            transaction: transaction,
          })
        : await modelName.update(updateAttributes, {
            where: where,
          });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * Common Create Query
   * @param modelName - On which Which Model we have to Search
   * @param bodyParams - Body Parameters for Inserting Values
   * @param transaction - Transaction
   * @returns {DAOInterface}- FindAll Result
   */
  public createDao = async (
    modelName: any,
    bodyParams: object,
    transaction?: Transaction
  ): Promise<DAOInterface> => {
    try {
      return transaction
        ? await modelName.create(bodyParams, {
            transaction: transaction,
          })
        : await modelName.create(bodyParams);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * Common Create Query
   * @param modelName - On which Which Model we have to Search
   * @param bodyParams - Body Parameters for Inserting Values
   * @param transaction - Transaction
   * @returns {DAOInterface}- FindAll Result
   */
  public deleteDao = async (
    modelName: any,
    bodyParams: object,
    transaction?: Transaction
  ): Promise<DAOInterface> => {
    try {
      return transaction
        ? await modelName.destroy(bodyParams, {
            transaction: transaction,
          })
        : await modelName.destroy(bodyParams);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * Common Manual Query
   * @param query - Raw SQL Query
   * @param options - Query Options (replacements, type, etc)
   * @param transaction - Transaction
   * @returns {any}- Query Result
   */
  public manualQueryDao = async (
    query: string,
    options: object = {},
    transaction?: Transaction
  ): Promise<any> => {
    try {
      const sequelize = db_connection_instane.getSequelizeInstance();
      return transaction
        ? await sequelize.query(query, {
            ...options,
            transaction: transaction,
          })
        : await sequelize.query(query, options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
