const catchError = require("../utils/error");
const {
  Participant,
  Contact,
  User,
  Arisan,
  History,
  sequelize,
} = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const { contactId } = req.body;
      const users = [];
      for (let i = 0; i < contactId.length; i++) {
        const data = await Contact.findOne({
          where: { userId: req.user.id, id: contactId[i] },
        });
        const search = await User.findOne({
          where: { phoneNumber: data.dataValues.phoneNumber },
        });
        const check = await Participant.findOne({
          where: {
            userId: search.dataValues.id,
            arisanId: req.params.arisanId,
          },
        });
        if (!check) {
          const user = {
            userId: search.dataValues.id,
            arisanId: req.params.arisanId,
            haveWon: false,
            havePaid: false,
          };
          users.push(user);
        } else {
        }
      }
      const participants = await Participant.bulkCreate(users);
      const arisan = await Arisan.findOne({
        where: {
          id: req.params.arisanId,
        },
      });
      const totalParticipant =
        arisan.dataValues.totalParticipant + users.length;
      await Arisan.update(
        {
          totalParticipant: totalParticipant,
        },
        {
          where: {
            id: req.params.arisanId,
          },
        }
      );
      res.status(200).json({
        status: "Success",
        message: "Successfully to create participant",
        result: participants,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  edit: async (req, res) => {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const test = await Participant.findOne({
        where: { id: req.params.participantId },
        include: {
          model: Arisan,
          as: "arisan",
          attributes: ["dues", "balance", "id"],
        },
        transaction,
      });

      const { havePaid } = req.body;
      await Participant.update(
        {
          havePaid: havePaid,
        },
        {
          where: {
            id: req.params.participantId,
          },
          returning: true,
        },
        { transaction }
      );

      if (test.havePaid == havePaid)
        return res.status(400).json({
          status: "Failed",
          message: "ga boleh sama",
          result: {},
        });

      let dues = test.dataValues.arisan.dataValues.dues;
      let balance = test.dataValues.arisan.dataValues.balance;
      if (havePaid) {
        balance += dues;
      } else {
        balance -= dues;
      }
      const result = await Arisan.update(
        {
          balance: balance,
        },
        {
          where: {
            id: test.dataValues.arisan.dataValues.id,
          },
          returning: true,
        },
        { transaction }
      );

      res.status(200).json({
        status: "Success",
        message: "Status Changed",
        result: result[1][0].dataValues,
      });
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      catchError(error, res);
    }
  },
  filter: async (req, res) => {
    try {
      const { haveWon, havePaid } = req.body;
      if (req.body.havePaid === true || req.body.havePaid === false) {
        var participants = await Participant.findAll({
          where: { havePaid: havePaid, arisanId: req.params.arisanId },
          include: [
            {
              model: User,
              as: "user",
              attributes: ["firstName", "phoneNumber", "image"]
            }
          ]
        });
      }
      else {
        var participants = await Participant.findAll({
          where: { haveWon: haveWon, arisanId: req.params.arisanId },
          include: [
            {
              model: User,
              as: "user",
              attributes: ["firstName", "phoneNumber", "image"]
            }
          ]
        });
      }
      const result = []
      let name

      for (let i = 0; i < participants.length; i++){
        var check = await Contact.findOne({
          where: {
            phoneNumber: participants[i].user.dataValues.phoneNumber,
            userId: req.user.id
          } 
        })
        if (check) {
         name = check.dataValues.name
        }
        else {
         name = participants[i].user.dataValues.firstName
        }
        const data = {
          name: name,
          phoneNumber: participants[i].user.dataValues.phoneNumber,
          image: participants[i].user.dataValues.image,
          haveWon: participants[i].dataValues.haveWon,
          havePaid: participants[i].dataValues.havePaid,
        }
        result.push(data)
        }
      res.status(200).json({
        status: "Success",
        message: "participant filtered",
        result: result,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  sort: async (req, res) => {
    try {
      const data = await History.findAll({
        order: [["createdAt", "DESC"]],
        where: {
          arisanId: req.params.arisanId,
        },
      });
      res.status(200).json({
        status: "success",
        message: "Participant successfully sorted",
        result: data,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  remove: async (req, res) => {
    try {
      const data = await Participant.findOne({
        where: { id: req.params.participantId },
        attributes: ["arisanId", "userId"],
        include: [{
          model: Arisan,
          as: "arisan",
          attributes: ["totalParticipant", "userId"]
        }]
      })
      if (data.dataValues.arisan.dataValues.userId ==! req.user.id) {
        return res.status(401).json({
          status: "Failed",
          message: "Unauthorized access",
          result: {},
        })
      }
      if (data.dataValues.userId == req.user.id) {
        return res.status(400).json({
          status: "Failed",
          message: "Cannot delete self",
          result: {},
        })
      }
      await Participant.destroy({
        where: {
          id: req.params.participantId,
        },
      });
      
      const totalParticipant = data.dataValues.arisan.dataValues.totalParticipant - 1
      await Arisan.update(
      {
        totalParticipant: totalParticipant
      },
      {
        where: {id: data.dataValues.arisanId}
      })
      res.status(200).json({
        status: "Success",
        message: "participant deleted",
        result: {},
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  fetchAll: async (req, res) => {
    try {
      const participants = await Participant.findAll({
        where: { arisanId: req.params.arisanId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["firstName","lastName","phoneNumber","image"],
          },
          {
            model: Arisan,
            as: "arisan",
            attributes: ["dues"],
          },
        ],
      });
      const result = []
      let name, dues

      for (let i = 0; i < participants.length; i++){
        var check = await Contact.findOne({
          where: {
            phoneNumber: participants[i].user.dataValues.phoneNumber,
            userId: req.user.id
          } 
        })
        if (check) {
         name = check.dataValues.name
        }
        else {
         name = participants[i].user.dataValues.firstName
        }
        if (participants[i].dataValues.havePaid) {
          dues = 0
        }
        else {
          dues = participants[i].arisan.dataValues.dues
        }
        const data = {
          name: name,
          phoneNumber: participants[i].user.dataValues.phoneNumber,
          image: participants[i].user.dataValues.image,
          haveWon: participants[i].dataValues.haveWon,
          havePaid: participants[i].dataValues.havePaid,
          id: participants[i].dataValues.id,
          dues: dues
        }
        result.push(data)
        }
        res.status(200).json({
          status: "Success",
          message: "participant fetched",
          result: result,
        });
      }    
     catch (error) {
      catchError(error, res);
    }
  },
};
