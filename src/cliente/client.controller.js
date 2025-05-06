import { response } from "express";
import Client from "./client.model.js";

export const listClients = async (req, res = response) => {
  try {
    const clients = await Client.find({ status: true });

    res.status(200).json({
      success: true,
      msg: "Clients retrieved successfully ✅",
      clients
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error retrieving clients ❌",
      error: error.message
    });
  }
};

export const createClient = async (req, res = response) => {
  try {
    const { name, contact, products_acquired } = req.body;

    const existingClient = await Client.findOne({ name });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        msg: "Client already exists ❌"
      });
    }

    const client = new Client({
      name,
      contact,
      products_acquired
    });

    await client.save();

    res.status(201).json({
      success: true,
      msg: "Client created successfully 🎉",
      client
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error creating client ❌",
      error: error.message
    });
  }
};

export const updateClient = async (req, res = response) => {
  try {
    const clientId = req.params.id;
    const { name, contact, products_acquired } = req.body;

    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return res.status(404).json({
        success: false,
        msg: "Client not found 🔍❌"
      });
    }

    const updatedClient = await Client.findByIdAndUpdate(clientId, {
      name,
      contact,
      products_acquired
    }, { new: true });

    res.status(200).json({
      success: true,
      msg: "Client updated successfully ✅",
      client: updatedClient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error updating client ❌",
      error: error.message
    });
  }
};


export const deleteClient = async (req, res = response) => {
  try {
    const clientId = req.params.id;

    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return res.status(404).json({
        success: false,
        msg: "Client not found 🔍❌"
      });
    }

    existingClient.status = false;
    await existingClient.save();

    res.status(200).json({
      success: true,
      msg: "Client deactivated successfully ✅",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error deactivating client ❌",
      error: error.message
    });
  }
};
