export interface DAOInterface {
  dataValues: any;
  id?: number;
  name?: number;
}

export interface FunctionInterface {
  findAll(data: object): Promise<Array<DAOInterface>>;
  findOne(data: object): Promise<DAOInterface>;
  update(data: object, data2: object): Promise<Array<DAOInterface>>;
  create(bodyParams: object, transaction?: object): Promise<DAOInterface>;
  destroy(bodyParams: object, transaction?: object): Promise<DAOInterface>;
}
