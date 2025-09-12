export default (sequelize, DataTypes) => {
  const EmployeeTracker = sequelize.define("employeeTracker", {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      },
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false
    },
    onLeave: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    permission: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assignTriage:{
      type: DataTypes.BOOLEAN,
      defaultValue:false
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
    },
  });

  EmployeeTracker.associate = (models) => {
    EmployeeTracker.belongsTo(models.Clients, {
      foreignKey: 'projectId',
      targetKey: 'id'
    });
  };

  return EmployeeTracker;
};