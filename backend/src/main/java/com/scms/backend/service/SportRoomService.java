package com.scms.backend.service;

import com.scms.backend.entity.Sport;
import com.scms.backend.entity.Room;
import com.scms.backend.exception.*;
import com.scms.backend.repository.SportRepository;
import com.scms.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SportRoomService {

    private final SportRepository sportRepository;
    private final RoomRepository roomRepository;

    // ======================== SPORTS ========================

    public List<Sport> getAllSports() {
        return sportRepository.findAll();
    }

    public Sport getSportById(Integer id) {
        return sportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sport", "id", id));
    }

    @Transactional
    public Sport createSport(String name, String description) {
        if (sportRepository.existsByName(name)) {
            throw new DuplicateResourceException("Sport", "name", name);
        }
        Sport sport = Sport.builder().name(name).description(description).build();
        return sportRepository.save(sport);
    }

    @Transactional
    public Sport updateSport(Integer id, String name, String description) {
        Sport sport = getSportById(id);
        if (!sport.getName().equals(name) && sportRepository.existsByName(name)) {
            throw new DuplicateResourceException("Sport", "name", name);
        }
        sport.setName(name);
        sport.setDescription(description);
        return sportRepository.save(sport);
    }

    // ======================== ROOMS ========================

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Integer id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
    }

    @Transactional
    public Room createRoom(String roomName, Integer maxCapacity, String location) {
        if (roomRepository.existsByRoomName(roomName)) {
            throw new DuplicateResourceException("Room", "roomName", roomName);
        }
        Room room = Room.builder()
                .roomName(roomName)
                .maxCapacity(maxCapacity)
                .location(location)
                .build();
        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(Integer id, String roomName, Integer maxCapacity, String location) {
        Room room = getRoomById(id);
        if (!room.getRoomName().equals(roomName) && roomRepository.existsByRoomName(roomName)) {
            throw new DuplicateResourceException("Room", "roomName", roomName);
        }
        room.setRoomName(roomName);
        room.setMaxCapacity(maxCapacity);
        room.setLocation(location);
        return roomRepository.save(room);
    }
}
