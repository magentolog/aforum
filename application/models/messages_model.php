<?php

class Messages_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function getTopicMessages($topic_id) {
        $this->db->select('m.*, u.nickname');
        $this->db->from('messages m');
        $this->db->join('topics t', 't.id = m.topic_id');
        $this->db->join('users u', 'u.id = m.user_id');
        $this->db->where('m.topic_id', $topic_id);
        return $this->db->get()->result_array();
    }

}
