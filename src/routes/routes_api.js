const express = require('express')
const router = express.Router()
const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const mysqlConnection = require('../database.js')

router.post('/formulario-contacto', (req, res) => {
	const { nombre, email, telefono, pais, mensaje, fecha } = req.body
	const msg = {
		to: process.env.CORREO,
		from: email,
		subject: '👨‍💻 Nuevo registro de formulario de contacto',
		text: `Nuevo registro\n
                Nombre: ${nombre}\n
                Email: ${email}\n
                Telefono: ${telefono}\n
                Pais: ${pais}\n
                Mensaje: ${mensaje}`,
		html: `<h1 style="color: #18C758">Nuevo registro</h1>
                <strong>Nombre: </strong>${nombre}<br/>
                <strong>Email: </strong>${email}<br/>
                <strong>Telefono: </strong>${telefono}<br/>
                <strong>Pais: </strong>${pais}<br/>
                <strong>Mensaje: </strong>${mensaje}`,
	}
	sgMail.send(msg)
	const query = `INSERT INTO formularios_contacto (nombre, email, telefono, pais, mensaje, fecha) values (?,?,?,?,?,?)`
	mysqlConnection.query(
		query,
		[nombre, email, telefono, pais, mensaje, fecha],
		(err, rows, fields) => {
			if (!err) {
				res.json({ status: 'Guardado' })
			} else {
				console.log(err)
				res.json({ error: 'ocurrió un error' })
			}
		}
	)
})

module.exports = router
