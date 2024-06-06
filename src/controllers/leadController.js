import moment from "moment";
import csv from "fast-csv";
import dotenv from "dotenv";
import fs from "fs"
import leads from "../models/leadsModel.js";

dotenv.config();

const BASE_URL = process.env.BASE_URL;

// Create New Leads
export const leadsCreate = async (req, res) => {
    try {
        const {
            customer_name,
            mobile,
            country_name,
            email,
            product_enquiry,
            segregation,
        } = req.body;

        // Check if all required fields are provided
        if (
            !customer_name ||
            !mobile ||
            !country_name ||
            !email ||
            !product_enquiry ||
            !segregation
        ) {
            res.status(401).json("All Inputs is required");
        }

        const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

        const newLeads = new leads({
            customer_name,
            mobile,
            country_name,
            email,
            product_enquiry,
            segregation,
            datecreated,
        });

        await newLeads.save();
        res.status(201).json(newLeads);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in creating Leads",
        });
    }
};

// singleLeadGet: Fetch a single Lead by ID
export const singleLeadGet = async (req, res) => {
    const { id } = req.params;

    try {
        // Find user by ID
        const leadData = await leads.findOne({ _id: id });

        if (!leadData) {
            res.status(404).json({ message: "Lead not found" });
        }

        res.status(200).json(leadData);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in while Searching Leads",
        });
    }
};

// getAllLeads: Fetch a All Leads 
export const getAllLeads = async (req, res) => {
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 4; // Number of items per page
    try {
        // Find Leads by ID
        const count = await leads.countDocuments();
        const skip = (page - 1) * ITEM_PER_PAGE;

        const leadsData = await leads.find().limit(ITEM_PER_PAGE).skip(skip);

        const pageCount = Math.ceil(count / ITEM_PER_PAGE);

        res.status(200).json({
            leadsData,
            Pagination: {
                count,
                pageCount,
            },
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in while Fetching all Leads",
        });
    }
};

// updateLeads: Edit Leads details
export const updateLeads = async (req, res) => {
    const { id } = req.params;
    const { customer_name,
        mobile,
        country_name,
        email,
        product_enquiry,
        segregation, } = req.body;

    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        // Find Leads by ID to ensure it exists
        const existingLeads = await leads.findById(id);

        if (!existingLeads) {
            res.status(404).json({ message: "Leads not found" });
        }

        const updateLead = await leads.findByIdAndUpdate(
            { _id: id },
            {
                customer_name,
                mobile,
                country_name,
                email,
                product_enquiry,
                segregation,
                dateUpdated,
            },
            {
                new: true,
            }
        );

        await updateLead.save();
        res.status(200).json(updateLead);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error while updating Leads",
        });
    }
};

// deleteLeads: Delete a Leads by ID
export const deleteLeads = async (req, res) => {
    const { id } = req.params;
    try {
        // Find and delete the Leads by ID
        const deletedLead = await leads.findByIdAndDelete({ _id: id });

        // Check if Leads was found and deleted
        if (!deletedLead) {
            return res.status(404).json({ message: "Leads not found" });
        }

        res.status(200).json(deletedLead);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error while deleting Leads",
        });
    }
};

// leadExport: Export Leads to a CSV file
export const leadExport = async (req, res) => {
    try {
        const leadsdata = await leads.find();

        const csvStream = csv.format({ headers: true });

        if (!fs.existsSync("./public/files/export/")) {
            if (!fs.existsSync("./public/files")) {
                fs.mkdirSync("./public/files/");
            }
            if (!fs.existsSync("./public/files/export")) {
                fs.mkdirSync("./public/files/export/");
            }
        }

        const writablestream = fs.createWriteStream(
            "./public/files/export/leads.csv"
        );

        csvStream.pipe(writablestream);

        writablestream.on("finish", function () {
            res.json({
                downloadUrl: `${BASE_URL}/public/files/export/leads.csv`,
            });
        });
        if (leadsdata.length > 0) {
            leadsdata.map((lead) => {
                csvStream.write({
                    Customer_Name: lead.customer_name ? lead.customer_name : "-",
                    Mobile: lead.mobile ? lead.mobile : "-",
                    Country_Name: lead.country_name ? lead.country_name : "-",
                    Email: lead.email ? lead.email : "-",
                    Product_Enquiry: lead.product_enquiry ? lead.product_enquiry : "-",
                    Segregation: lead.segregation ? lead.segregation : "-",
                    DateCreated: lead.datecreated ? lead.datecreated : "-",
                    DateUpdated: lead.dateUpdated ? lead.dateUpdated : "-",
                });
            });
        }
        csvStream.end();
        writablestream.end();
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error while Export Leads",
        });
    }
};

//leadImport: Import Leads to a DB 
export const leadImport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Please upload a CSV file!" });
        }

        const results = [];
        const filePath = req.file.path;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('error', error => res.status(500).send({ message: "Error reading CSV file", error: error.message }))
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    // Insert CSV data into the database
                    await leads.insertMany(results);
                    res.status(200).send({ message: "Leads have been successfully imported" });
                } catch (error) {
                    res.status(500).send({ message: "Error inserting leads into the database", error: error.message });
                } finally {
                    // Clean up the uploaded file
                    fs.unlinkSync(filePath);
                }
            });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in importing leads"
        });
    }
};
