const { Arisan, Participant, History, User, Memory } = require("../models");
const catchError = require("../utils/error");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const moment = require("moment");

module.exports = {
  createArisan: async (req, res) => {
    const body = req.body;
    let user_id = req.user.id;
    try {
      const arisan = await Arisan.create({
        ...body,
        userId: user_id,
        totalParticipant: 1,
        balance: 0,
        lotteryDate: moment(body.lotteryDate, "DD-MM-YYYY"),
      });
      await Participant.create({
        userId: user_id,
        arisanId: arisan.dataValues.id,
        haveWon: false,
        havePaid: false,
      });
      res.status(201).json({
        status: "Success",
        message: "Successfully create arisan",
        result: arisan,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  getArisans: async (req, res) => {
    try {
      const participant = await Participant.findAll({
        limit: 10,
        order: [["arisanId", "ASC"]],
        where: { userId: req.user.id },
        attributes: ["arisanId"],
        include: [
          {
            model: Arisan,
            as: "arisan",
            attributes: [
              "userId",
              "idArisan",
              "title",
              "dues",
              "paymentPeriod",
              "lotteryDate",
              "balance",
              "totalParticipant",
              "status",
            ],
          },
        ],
      });
      if (participant.length == 0) {
        return res.status(400).json({
          status: "Not Found",
          message: "Data does not exist!",
          result: {},
        });
      }
      res.status(201).json({
        status: "success",
        message: "Arisan successfully retrieved",
        result: participant,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  getArisan: async (req, res) => {
    const { arisanId } = req.params;
    try {
      const arisan = await Arisan.findByPk(arisanId);
      if (arisan.length == 0) {
        return res.status(400).json({
          status: "Not Found",
          message: "Data does not exist!",
          result: {},
        });
      }

      const check = await Memory.findAll();

      if (check.length != 5) {
        await Memory.create({
          arisanId: arisanId,
        });
      } else {
        const search = await Memory.findOne({
          order: [["updatedAt", "ASC"]],
        });
        const last = search.dataValues.id;
        await Memory.update(
          {
            arisanId: arisanId,
          },
          {
            where: {
              id: last,
            },
          }
        );
      }
      res.status(201).json({
        status: "Success",
        message: "Arisan successfully retrieved",
        result: arisan,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  updateArisan: async (req, res) => {
    const { arisanId } = req.params;
    const body = req.body;
    try {
      const checkUpdate = await Arisan.update(
        { ...body, lotteryDate: moment(body.lotteryDate, "DD-MM-YYYY") },
        {
          where: {
            id: arisanId,
          },
        }
      );
      if (checkUpdate[0] != 1) {
        return res.status(200).json({
          status: "Not Found",
          message: "Data does not exist!",
          result: {},
        });
      }
      const updatedArisan = await Arisan.findByPk(arisanId, {
        attributes: { exclude: ["status", "createdAt"] },
      });
      res.status(201).json({
        status: "Success",
        message: "Arisan successfully updated",
        result: updatedArisan,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  deleteArisan: async (req, res) => {
    const { arisanId } = req.params;
    try {
      const arisan = await Arisan.destroy({
        where: {
          id: arisanId,
        },
      });
      if (!arisan) {
        return res.status(200).json({
          status: "Not Found",
          message: "Data does not exist!",
          result: {},
        });
      }
      res.status(201).json({
        status: "Success",
        message: "Arisan successfully deleted",
        result: {},
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  filterArisan: async (req, res) => {
    const { order } = req.query;
    try {
      let sort;
      switch (order) {
        case "ztoa":
          sort = [[{ model: Arisan, as: "arisan" }, "title", "DESC"]];
          break;
        case "anggota":
          sort = [
            [{ model: Arisan, as: "arisan" }, "totalParticipant", "DESC"],
          ];
          break;
        default:
          {
            sort = [[{ model: Arisan, as: "arisan" }, "title", "ASC"]];
          }
          break;
      }

      const participant = await Participant.findAll({
        limit: 10,
        order: sort,
        where: { userId: req.user.id },
        attributes: ["arisanId"],
        include: [
          {
            model: Arisan,
            as: "arisan",
            attributes: [
              "userId",
              "idArisan",
              "title",
              "dues",
              "paymentPeriod",
              "lotteryDate",
              "balance",
              "totalParticipant",
              "status",
            ],
          },
        ],
      });

      if (!participant) {
        return res.status(200).json({
          status: "Not Found",
          message: "Data does not exist!",
          result: {},
        });
      }
      res.status(200).json({
        status: "success",
        message: "Arisan successfully retrieved",
        result: participant,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  searchArisan: async (req, res) => {
    try {
      const findArisan = await Arisan.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.iLike]: `%${req.query.title}%`,
              },
            },
            {
              idArisan: {
                [Op.iLike]: `%${req.query.idArisan}%`,
              },
            },
          ],
        },
      });
      if (findArisan.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          message: "Data does not exist!",
          result: {},
        });
      }
      res.status(200).json({
        status: "success",
        message: "Arisan successfully retrieved",
        result: findArisan,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  startRaffle: async (req, res) => {
    try {
      const participant = await Participant.findAll({
        where: {
          arisanId: req.params.arisanId,
          haveWon: false,
          havePaid: true
        },
      });
      if (participant.length == 0)
        return res.status(400).json({
          status: "Failed",
          message: "Sudah menang Semua",
          result: {},
        });

      const participants = [];
      for (let i = 0; i < participant.length; i++) {
        participants.push(participant[i].id);
      }
      const randNumb = Math.floor(Math.random() * participants.length);
      const winner = await Participant.findByPk(participants[randNumb], {
        attributes: ["userId", "arisanId"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["firstName", "lastName", "image"],
          },
          {
            model: Arisan,
            as: "arisan",
            attributes: ["balance"],
          },
        ],
      });

      await Participant.update(
        { haveWon: true },
        { where: { id: participants[randNumb] } }
      );

      const search = await Participant.findAll({
        where: {
          haveWon: true,
          arisanId: req.params.arisanId,
        },
      });
      const next = search.length;
      const periode = 0;
      await History.create({
        participantId: participants[randNumb],
        periode: periode + next,
        arisanId: req.params.arisanId,
        balance: winner.dataValues.arisan.dataValues.balance
      });

      await Participant.update(
        { havePaid: false },
        { where: { arisanId : req.params.arisanId } }
      );
      await Arisan.update(
        { balance: 0 },
        { where: { id : req.params.arisanId } }
      );
      winner.dataValues.periode = periode + next
      console.log(winner.periode)
      res.status(200).json({
        status: "Success",
        message: "Raffle Succsessfull",
        result: winner,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  fetchHistory: async (req, res) => {
    try {
      const data = await History.findAll({
        include: {
          model: Participant,
          attributes: ["userId"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["firstName", "lastName"],
            },
          ],
        },
        where: {
          arisanId: req.params.arisanId,
        },
      });

      res.status(200).json({
        status: "Success",
        message: "Fetch Succsessfull",
        result: data,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  sortArisanByMemory: async (req, res) => {
    try {
      const data = await Memory.findAll({
        order: [["updatedAt", "DESC"]],
      });
      res.status(200).json({
        status: "Success",
        message: "sort Succsessfull",
        result: data,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  editStatus: async (req, res) => {
    try {
      const { status } = req.body
      await Arisan.update({
        status: status
      }, {
        where: { id: req.params.arisanId }
      })
      res.status(200).json({
        status: "Success",
        message: "edit Succsessfull",
        result: {},
      });
    } catch (error) {
      catchError(error, res);
    }
  },
};
