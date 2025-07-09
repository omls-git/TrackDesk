module.exports = (sequelize, DataTypes) =>{
  const Clients = sequelize.define("clients", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true 
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdOn: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true
    },
    modifiedBy: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true
    },
    modifiedOn: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true
    }
  });

  return Clients;
}