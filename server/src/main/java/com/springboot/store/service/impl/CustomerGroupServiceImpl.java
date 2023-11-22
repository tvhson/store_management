package com.springboot.store.service.impl;

import com.springboot.store.entity.CustomerGroup;
import com.springboot.store.payload.CustomerGroupDTO;
import com.springboot.store.repository.CustomerGroupRepository;
import com.springboot.store.service.CustomerGroupService;
import com.springboot.store.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerGroupServiceImpl implements CustomerGroupService {
    private final CustomerGroupRepository customerGroupRepository;
    private final ModelMapper modelMapper;
    private final StaffService staffService;

    @Override
    public CustomerGroupDTO createCustomerGroup(CustomerGroupDTO customerGroupDTO) {
        customerGroupDTO.setCreator(Integer.toString(staffService.getAuthorizedStaff().getId()));
        CustomerGroup customerGroup = modelMapper.map(customerGroupDTO, CustomerGroup.class);
        customerGroup.setCreatedAt(new Date());
        customerGroup.setCreator(staffService.getAuthorizedStaff());
        customerGroup = customerGroupRepository.save(customerGroup);
        return modelMapper.map(customerGroup, CustomerGroupDTO.class);
    }

    @Override
    public CustomerGroupDTO updateCustomerGroup(int id, CustomerGroupDTO customerGroupDTO) {
        CustomerGroup existingCustomerGroup = customerGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer group not found with id: " + id));
        existingCustomerGroup.setName(customerGroupDTO.getName());
        existingCustomerGroup.setDescription(customerGroupDTO.getDescription());
        existingCustomerGroup = customerGroupRepository.save(existingCustomerGroup);
        customerGroupDTO = modelMapper.map(existingCustomerGroup, CustomerGroupDTO.class);
        customerGroupDTO.setCreator(Integer.toString(existingCustomerGroup.getCreator().getId()));
        return customerGroupDTO;
    }

    @Override
    public List<CustomerGroupDTO> getAllCustomerGroups() {
        List<CustomerGroup> customerGroups = customerGroupRepository.findAll();
        return customerGroups.stream()
                .map(customerGroup -> {
                    CustomerGroupDTO customerGroupDTO = modelMapper.map(customerGroup, CustomerGroupDTO.class);
                    customerGroupDTO.setCreator(Integer.toString(customerGroup.getCreator().getId()));
                    return customerGroupDTO;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public CustomerGroupDTO getCustomerGroupById(int id) {
        CustomerGroup customerGroup = customerGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer group not found with id: " + id));
        CustomerGroupDTO customerGroupDTO = modelMapper.map(customerGroup, CustomerGroupDTO.class);
        customerGroupDTO.setCreator(Integer.toString(customerGroup.getCreator().getId()));
        return customerGroupDTO;
    }

    @Override
    public void deleteCustomerGroup(int id) {
        customerGroupRepository.deleteById(id);
    }
}
