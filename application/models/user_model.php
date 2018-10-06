<?php

class User_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function getUserList() {
        $this->db->select('u.*, count(t.id) as topic_count');
        $this->db->from('users u');
        $this->db->join('topics t', 't.user_id = u.id', 'left');
        $this->db->group_by('u.id');
        return $this->db->get()->result_array();
    }
    
    public function getUser($email, $password) {
        $this->db->select('u.*');
        $this->db->from('users u');
        $this->db->where('u.email', $email);
        $this->db->where('u.password', $password);
        return $this->db->get()->row_array();
    }
    
    public function addUser($post) {
        $this->db->insert('users', $post);        
        $user_id = $this->db->insert_id();
        if (!empty($user_id)) {
            $user = $this->db->get_where('users', array('id'=>$user_id))->row_array();
            return $user;
        } else {
            return FALSE;
        }
    }
    

}
