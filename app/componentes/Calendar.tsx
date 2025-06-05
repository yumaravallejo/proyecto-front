'use client'

import { useEffect, useState } from 'react'
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    getDay,
    parseISO,
    isSameDay,
} from 'date-fns'
import { toast, Toaster } from 'sonner'
import AddEvento from './AddEvento'
import DeleteDialog from './DeleteHorario'
import EditarEvento from './EditEvento'

interface Evento {
    id: number
    nombre: string
    detallesEvento: string
    fechaInicio: string
    fechaFin?: string
}

interface Dia {
    fecha: Date
    eventos: Evento[]
}

interface Usuario {
    id: number;
    tipo: string;
    nombre: string;
    email: string;
    token: string;
}

export default function Calendar() {
    const [eventos, setEventos] = useState<Evento[]>([])
    const [eventosPorDia, setEventosPorDia] = useState<Dia[]>([])
    const [diaSeleccionado, setDiaSeleccionado] = useState<Dia | null>(null)
    const [user, setUser] = useState<Usuario | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [quieresEliminar, setQuieresEliminar] = useState(false)
    const [idSeleccionada, setIdSeleccionada] = useState(0)
    const [quieresEditar, setQuieresEditar] = useState(false)
    const [eventoEditar, setEventoEditar] = useState<Evento | null>(null)

    useEffect(() => {
        const hoy = new Date()
        const inicio = startOfMonth(hoy)
        const fin = endOfMonth(hoy)
        const dias = eachDayOfInterval({ start: inicio, end: fin })

        const placeholders: Dia[] = dias.map((fecha) => ({ fecha, eventos: [] }))
        setEventosPorDia(placeholders)
    }, [])

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (!user) {
            toast.error('Debes iniciar sesión para ver el calendario')
            return
        }

        setUser(JSON.parse(user))
        fetchEventos()
    }, [])

    const fetchEventos = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}usuarios/getEventos`)
            if (!response.ok) throw new Error('Error al cargar los eventos')

            const data = await response.json()
            setEventos(data)
        } catch (error) {
            console.error('Error fetching eventos:', error)
            toast.error('Error al cargar los eventos')
        }
    }

    useEffect(() => {
        if (!eventosPorDia.length || !eventos.length) return

        const actualizados = eventosPorDia.map((dia) => {
            const eventosDelDia = eventos.filter((ev) =>
                isSameDay(parseISO(ev.fechaInicio), dia.fecha)
            )
            return { ...dia, eventos: eventosDelDia }
        })

        setEventosPorDia(actualizados)
    }, [eventos])

    useEffect(() => {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        const diaHoy = eventosPorDia.find((dia) =>
            new Date(dia.fecha).setHours(0, 0, 0, 0) === hoy.getTime()
        )

        setDiaSeleccionado(diaHoy || null)
    }, [eventosPorDia])

    const handleEliminar = (id: number) => async () => {
        if (!user || user.tipo !== 'Entrenador') {
            toast.error('Solo los entrenadores pueden eliminar eventos')
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}entrenador/eliminarEvento/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            })

            if (!response.ok) {
                toast.error('Error al eliminar el evento')
            } else {
                toast.success('Evento eliminado exitosamente')
                fetchEventos()
            }
        } catch (error) {
            console.error('Error eliminando evento:', error)
            toast.error('Error al eliminar el evento')
        }
    }

    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    return (
        <div className="p-4 mx-auto flex flex-col items-start sm:items-end sm:p-10">
            <Toaster position="top-center" theme="dark" />

            {user?.tipo === 'Entrenador' && (
                <button onClick={() => setIsDialogOpen(true)} className="mb-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition active:scale-95 flex items-center gap-2">
                    <img src="/addHorario.svg" title="Añadir Horario" className="w-7 h-7" />
                    <span>Añadir Evento</span>
                </button>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full">
                {/* Calendario */}
                <div className="sm:basis-3/4 w-full">
                    <div className="hidden sm:grid grid-cols-7 text-center text-sm font-semibold mb-2">
                        {diasSemana.map((dia) => <div key={dia}>{dia}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-[10px] sm:text-xs">

                        {Array((getDay(startOfMonth(new Date())) + 6) % 7)
                            .fill(null)
                            .map((_, idx) => <div key={`empty-${idx}`} />)}

                        {eventosPorDia.map((dia) => {
                            const tieneEvento = dia.eventos.length > 0
                            const esPasado = dia.fecha < new Date(new Date().setHours(0, 0, 0, 0))
                            const esSeleccionado =
                                diaSeleccionado &&
                                new Date(dia.fecha).setHours(0, 0, 0, 0) ===
                                new Date(diaSeleccionado.fecha).setHours(0, 0, 0, 0)

                            return (
                                <div
                                    key={dia.fecha.toISOString()}
                                    className={`aspect-square border rounded-md flex flex-col p-1 cursor-pointer
                                        ${esSeleccionado
                                            ? 'bg-[var(--dorado-claro)] text-gray-900 ring-2 ring-yellow-400'
                                            : esPasado
                                                ? 'bg-gray-200 text-gray-400'
                                                : tieneEvento
                                                    ? 'bg-blue-100 hover:bg-blue-200 sm:bg-white sm:hover:bg-blue-200'
                                                    : 'hover:bg-gray-100 sm:hover:bg-blue-200'
                                        }`}
                                    onClick={() => setDiaSeleccionado(dia)}
                                >
                                    <div className="text-gray-700 text-xs">{format(dia.fecha, 'd')}</div>

                                    <div className="flex flex-col mt-2 gap-1 overflow-hidden hidden sm:block">
                                        {dia.eventos.slice(0, 3).map((ev, index) => (
                                            <div key={ev.id} className={`flex items-center gap-2 ${index > 0 ? 'hidden sm:flex' : ''}`}>
                                                <span className="text-white bg-[var(--azul)] p-2 w-full rounded-lg text-xs truncate">{ev.nombre}</span>
                                            </div>
                                        ))}
                                        {dia.eventos.length > 3 && (
                                            <div className="text-xs text-gray-500 hidden sm:block">+{dia.eventos.length - 3} más</div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Panel lateral */}
                <div className="w-full sm:w-1/4">
                    {diaSeleccionado && (
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-md">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xl font-semibold text-[var(--azul)]">
                                    {format(diaSeleccionado.fecha, 'd MMMM yyyy')}
                                </h3>
                                <button
                                    onClick={() => setDiaSeleccionado(null)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Cerrar
                                </button>
                            </div>

                            {diaSeleccionado.eventos.length > 0 ? (
                                diaSeleccionado.eventos.map((ev) => (
                                    <div key={ev.id} className="mb-3 p-3 bg-white border border-blue-100 rounded-lg shadow-sm">
                                        <h4 className="text-[var(--azul)] font-semibold text-lg">{ev.nombre}</h4>
                                        <small className="text-gray-500">
                                            {ev.fechaInicio ? format(parseISO(ev.fechaInicio), 'HH:mm') : ''} - {ev.fechaFin ? format(parseISO(ev.fechaFin), 'HH:mm') : ''}
                                        </small>
                                        <p className="text-gray-600 text-sm mt-1">{ev.detallesEvento}</p>

                                        {user?.tipo === 'Entrenador' && (
                                            <div className="flex justify-between w-full gap-2">
                                                <button onClick={() => { setQuieresEliminar(true); setIdSeleccionada(ev.id) }}
                                                    className="flex justify-center h-9 items-center gap-2 text-white rounded-full w-full bg-red-600 hover:bg-red-700 mt-3">
                                                    <img src="/white-bin.svg" alt="Eliminar Evento" className="w-6 h-6" />
                                                    Eliminar
                                                </button>
                                                <button onClick={() => { setQuieresEditar(true); setEventoEditar(ev) }}
                                                    className="flex justify-center h-9 items-center gap-2 text-white rounded-full w-full bg-blue-600 hover:bg-blue-700 mt-3">
                                                    <img src="/edit.svg" alt="Editar Evento" className="w-6 h-6" />
                                                    Editar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No hay eventos.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Diálogos */}
            <AddEvento open={isDialogOpen} onClose={() => setIsDialogOpen(false)} recargarEventos={fetchEventos} />
            <DeleteDialog open={quieresEliminar} id={idSeleccionada} onCancel={() => { setQuieresEliminar(false); setIdSeleccionada(0) }} onConfirm={handleEliminar(idSeleccionada)} />
            <EditarEvento open={quieresEditar} evento={eventoEditar} onClose={() => { setQuieresEditar(false); setEventoEditar(null) }} recargarEventos={fetchEventos} />
        </div>
    )
}
