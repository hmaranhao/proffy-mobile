import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text, TextInput } from 'react-native'
import { BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'
import { useFocusEffect } from '@react-navigation/native'

import PageHeader from '../../components/PageHeader'
import TeacherItem, { TeacherProps } from './../../components/TeacherItem'
import api from '../../services/api'

import styles from './styles'

function TeacherList() {

    const [isFiltersVisible, setIsFilterVisible] = useState(false)
    const [teachers, setTeachers] = useState<Array<TeacherProps>>([])
    const [favorites, setFavorites] = useState<number[]>([])
    const [filters, setFilters] = useState({
        subject: '',
        week_day: '',
        time: ''
    })

    function loadTeacherClasses() {

        api.get('/classes', { params: filters })
            .then(response => {
                setTeachers(response.data ?? [])
                setIsFilterVisible(false)
            })
    }

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response)
                const favoritedTeachersIds = favoritedTeachers.map((t: TeacherProps) => t.id)
                setFavorites(favoritedTeachersIds)
            }
        })
    }

    function apllyFilters() {
        loadFavorites()
        loadTeacherClasses()
    }

    useFocusEffect(() => {
        loadFavorites()
    })

    return (
        <View
            style={styles.container}
        >
            <PageHeader
                title="Proffys disponíveis"
                headerRight={(
                    <BorderlessButton onPress={() => setIsFilterVisible(!isFiltersVisible)}>
                        <Feather name="filter" size={20} color="#fff" />
                    </BorderlessButton>
                )}
            >
                {isFiltersVisible && (<View style={styles.searchForm}>
                    <Text style={styles.label}>Matéria</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Qual a matéria?"
                        placeholderTextColor="#c1bccc"
                        value={filters.subject}
                        onChangeText={text => setFilters({ ...filters, subject: text })}
                    />
                    <View
                        style={styles.inputGroup}
                    >
                        <View
                            style={styles.inputBlock}
                        >
                            <Text style={styles.label}>Dia da semana</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Qual o dia?"
                                placeholderTextColor="#c1bccc"
                                value={filters.week_day}
                                onChangeText={text => setFilters({ ...filters, week_day: text })}
                            />
                        </View>
                        <View
                            style={styles.inputBlock}
                        >
                            <Text style={styles.label}>Horário</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Qual a hora?"
                                placeholderTextColor="#c1bccc"
                                value={filters.time}
                                onChangeText={text => setFilters({ ...filters, time: text })}
                            />
                        </View>
                    </View>
                    <RectButton style={styles.submitButton} onPress={apllyFilters}>
                        <Text style={styles.submitButtonText}>Buscar</Text>
                    </RectButton>
                </View>)}

            </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map(teacher => {
                    const favorited = favorites.includes(teacher.id)
                    return (
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            favorited={favorited}
                        />
                    )
                })}
            </ScrollView>

        </View>
    )
}

export default TeacherList