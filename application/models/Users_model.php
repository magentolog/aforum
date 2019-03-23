<?php

class Users_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    public function getUsers() {
        $this->db->select('u.*');
        $this->db->from('users u');
        return $this->db->get()->result_array();
    }

    public function getUser($id) {
        $this->db->select('u.*');
        $this->db->from('users u');
        $this->db->where('u.id', $id);
        return $this->db->get()->row_array();
    }

    public function addUser($post) {
        unset($post['id']);
        $this->db->insert('users', $post);
        $user_id = $this->db->insert_id();
        if (!empty($user_id)) {
            $user = $this->db->get_where('users', array('id' => $user_id))->row_array();
            return $user;
        } else {
            return FALSE;
        }
    }

    public function editUser($post) {
        $id = $post['id'];
        unset($post['id']);
        $this->where('id', $id);
        $this->db->update('users', $post);
    }

    public function deleteUser($id) {
        $this->where('id', $id);
        $this->db->delete('users');
    }

}
